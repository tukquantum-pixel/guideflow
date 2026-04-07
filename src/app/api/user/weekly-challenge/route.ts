import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"
import { getCurrentChallenge, computeChallengeProgress } from "@/lib/weekly-challenge"

// GET /api/user/weekly-challenge — Returns current weekly challenge with user's progress
export async function GET() {
    try {
        const auth = await mobileOrSessionAuth()
        if (!auth) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

        const challenge = getCurrentChallenge()

        // Get this week's stats (Monday to Sunday)
        const now = new Date()
        const dayOfWeek = now.getDay()
        const monday = new Date(now)
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        monday.setHours(0, 0, 0, 0)

        const weeklyRecordings = await prisma.recordedRoute.findMany({
            where: {
                userId: auth.id,
                startedAt: { gte: monday },
            },
            select: { distance: true, elevationGain: true },
        })

        const weeklyStats = {
            km: weeklyRecordings.reduce((sum: number, r: { distance: number | null }) => sum + (r.distance || 0), 0) / 1000,
            elevation: weeklyRecordings.reduce((sum: number, r: { elevationGain: number | null }) => sum + (r.elevationGain || 0), 0),
            routes: weeklyRecordings.length,
        }

        const progress = computeChallengeProgress(challenge, weeklyStats)

        return NextResponse.json({ challenge, ...progress, weeklyStats })
    } catch (error) {
        console.error("[WEEKLY_CHALLENGE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
