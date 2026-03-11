import { NextRequest, NextResponse } from "next/server"
import { userAuth } from "@/lib/user-auth"
import { prisma } from "@/lib/db"

// POST /api/tracks/complete
// Marks an in-progress track as completed and finalizes its data
export async function POST(req: NextRequest) {
    try {
        const session = await userAuth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { trackId, title, distance, elevationGain, duration, finishedAt } = await req.json()
        if (!trackId) return NextResponse.json({ error: "Falta trackId" }, { status: 400 })

        const route = await prisma.recordedRoute.findFirst({
            where: { id: trackId, userId: session.user.id },
        })
        if (!route) return NextResponse.json({ error: "Track no encontrado" }, { status: 404 })

        const updated = await prisma.recordedRoute.update({
            where: { id: trackId },
            data: {
                title: title || route.title,
                distance: distance ?? route.distance,
                elevationGain: elevationGain ?? route.elevationGain,
                duration: duration ?? route.duration,
                finishedAt: finishedAt ? new Date(finishedAt) : new Date(),
                synced: true,
            },
        })

        return NextResponse.json({
            id: updated.id, title: updated.title,
            distance: updated.distance, elevationGain: updated.elevationGain,
            duration: updated.duration, status: "completed",
        })
    } catch (error) {
        console.error("[TRACK_COMPLETE] Error:", error)
        return NextResponse.json({ error: "Error finalizando track" }, { status: 500 })
    }
}
