import { NextRequest, NextResponse } from "next/server"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"
import { prisma } from "@/lib/db"

// POST /api/tracks/offline-chunk
// Accepts a batch of GPS points for an in-progress recording
// The app sends chunks periodically when it has connectivity
export async function POST(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { trackId, points, distance, elevationGain, duration } = await req.json()
        if (!trackId || !points?.length) return NextResponse.json({ error: "Faltan datos" }, { status: 400 })

        // Upsert: create if first chunk, append if subsequent
        const existing = await prisma.recordedRoute.findFirst({
            where: { id: trackId, userId: authed.id },
        })

        if (existing) {
            const merged = [...(existing.coordinates as number[][]), ...points]
            await prisma.recordedRoute.update({
                where: { id: trackId },
                data: {
                    coordinates: merged,
                    distance: distance ?? existing.distance,
                    elevationGain: elevationGain ?? existing.elevationGain,
                    duration: duration ?? existing.duration,
                },
            })
            return NextResponse.json({ id: trackId, pointsTotal: merged.length, status: "updated" })
        }

        const route = await prisma.recordedRoute.create({
            data: {
                id: trackId,
                userId: authed.id,
                title: `Ruta ${new Date().toLocaleDateString("es-ES")}`,
                coordinates: points,
                distance: distance || 0,
                elevationGain: elevationGain || 0,
                duration: duration || 0,
                startedAt: new Date(),
                finishedAt: new Date(),
                synced: false,
            },
        })

        return NextResponse.json({ id: route.id, pointsTotal: points.length, status: "created" }, { status: 201 })
    } catch (error) {
        console.error("[OFFLINE_CHUNK] Error:", error)
        return NextResponse.json({ error: "Error procesando chunk" }, { status: 500 })
    }
}
