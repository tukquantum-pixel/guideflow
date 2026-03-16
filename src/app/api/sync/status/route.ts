import { NextResponse } from "next/server"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"
import { prisma } from "@/lib/db"

// GET /api/sync/status
// Returns pending (unsynced) tracks so the app knows what to re-upload
export async function GET() {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const pending = await prisma.recordedRoute.findMany({
            where: { userId: authed.id, synced: false },
            select: { id: true, title: true, distance: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        })

        const completed = await prisma.recordedRoute.count({
            where: { userId: authed.id, synced: true },
        })

        return NextResponse.json({ pending, pendingCount: pending.length, completedCount: completed })
    } catch (error) {
        console.error("[SYNC_STATUS] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
