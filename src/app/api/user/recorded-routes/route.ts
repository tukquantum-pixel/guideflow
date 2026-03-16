import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

export async function POST(req: Request) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const body = await req.json()
        const { title, coordinates, distance, elevationGain, duration, startedAt, finishedAt } = body

        if (!coordinates || coordinates.length < 2) {
            return NextResponse.json({ error: "Ruta demasiado corta" }, { status: 400 })
        }

        const route = await prisma.recordedRoute.create({
            data: {
                userId: authed.id,
                title: title || `Ruta ${new Date().toLocaleDateString("es-ES")}`,
                coordinates, distance: distance || 0,
                elevationGain: elevationGain || 0, duration: duration || 0,
                startedAt: new Date(startedAt), finishedAt: new Date(finishedAt),
            },
        })

        return NextResponse.json({ id: route.id, message: "Ruta guardada" })
    } catch (error) {
        console.error("[RECORDED_ROUTES_POST] Error:", error)
        return NextResponse.json({ error: "Error al guardar la ruta" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const routes = await prisma.recordedRoute.findMany({
            where: { userId: authed.id },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true, distance: true, elevationGain: true, duration: true, createdAt: true },
        })

        return NextResponse.json({ routes, total: routes.length })
    } catch (error) {
        console.error("[RECORDED_ROUTES_GET] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
