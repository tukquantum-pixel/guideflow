import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { parseGPX } from "@/lib/gpx-parser"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const formData = await req.formData()
        const file = formData.get("gpx") as File | null
        const activityId = formData.get("activityId") as string | null

        if (!file || !activityId) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
        if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Archivo muy grande (máx 10MB)" }, { status: 400 })

        const activity = await prisma.activity.findUnique({ where: { id: activityId } })
        if (!activity || activity.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        const gpxContent = await file.text()
        const stats = parseGPX(gpxContent)

        const track = await prisma.track.upsert({
            where: { activityId },
            create: {
                activityId,
                name: file.name,
                gpxData: gpxContent,
                geojson: stats.geojson,
                distance: stats.distance,
                elevationGain: stats.elevationGain,
                elevationLoss: stats.elevationLoss,
                durationEst: stats.durationEst,
            },
            update: {
                name: file.name,
                gpxData: gpxContent,
                geojson: stats.geojson,
                distance: stats.distance,
                elevationGain: stats.elevationGain,
                elevationLoss: stats.elevationLoss,
                durationEst: stats.durationEst,
            },
        })

        return NextResponse.json({ track: { id: track.id, name: track.name, distance: track.distance, elevationGain: track.elevationGain, elevationLoss: track.elevationLoss, durationEst: track.durationEst } }, { status: 201 })
    } catch (error) {
        console.error("[TRACK_UPLOAD]", error)
        return NextResponse.json({ error: "Error procesando GPX" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const { activityId } = await req.json()
        const activity = await prisma.activity.findUnique({ where: { id: activityId } })
        if (!activity || activity.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }
        await prisma.track.delete({ where: { activityId } })
        return NextResponse.json({ deleted: true })
    } catch (error) {
        console.error("[TRACK_DELETE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
