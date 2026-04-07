import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"
import { computeAchievements } from "@/lib/achievements"

// GET /api/user/achievements — Returns computed achievements for the authenticated user
export async function GET() {
    try {
        const auth = await mobileOrSessionAuth()
        if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

        // Aggregate user stats from recorded routes
        const recordings = await prisma.recordedRoute.findMany({
            where: { userId: auth.id },
            select: { distance: true, elevationGain: true },
        })

        const stats = {
            totalKm: recordings.reduce((sum: number, r: { distance: number | null }) => sum + (r.distance || 0), 0) / 1000,
            totalElevation: recordings.reduce((sum: number, r: { elevationGain: number | null }) => sum + (r.elevationGain || 0), 0),
            totalRoutes: recordings.length,
        }

        const achievements = computeAchievements(stats)

        return NextResponse.json({ achievements, stats })
    } catch (error) {
        console.error("[USER_ACHIEVEMENTS]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
