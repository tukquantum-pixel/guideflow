import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// POST /api/cron/digest — Weekly digest: expired credentials + upcoming bookings
// Secured via CRON_SECRET header (set by Vercel/external scheduler)
export async function POST(req: NextRequest) {
    const secret = req.headers.get("x-cron-secret")
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const results: Record<string, number> = {}

    // 1. Expire old credentials (> 1 year without renewal)
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    const expiredCredentials = await prisma.credential.updateMany({
        where: {
            status: "APPROVED",
            updatedAt: { lt: oneYearAgo },
        },
        data: { status: "EXPIRED" },
    })
    results.expiredCredentials = expiredCredentials.count

    // 2. Auto-cancel old PENDING bookings (> 48h without payment)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
    const stalePending = await prisma.booking.findMany({
        where: {
            status: "PENDING",
            createdAt: { lt: twoDaysAgo },
        },
        select: { id: true, numPeople: true, timeSlotId: true },
    })

    for (const b of stalePending) {
        await prisma.$transaction(async (tx) => {
            await tx.booking.update({ where: { id: b.id }, data: { status: "CANCELLED" } })
            await tx.timeSlot.update({
                where: { id: b.timeSlotId },
                data: { spotsRemaining: { increment: b.numPeople }, status: "AVAILABLE" },
            })
        })
    }
    results.cancelledStaleBookings = stalePending.length

    // 3. Mark completed bookings (past date + confirmed)
    const completedBookings = await prisma.booking.updateMany({
        where: {
            status: "CONFIRMED",
            timeSlot: { date: { lt: now } },
        },
        data: { status: "COMPLETED" },
    })
    results.completedBookings = completedBookings.count

    // 4. Close full time slots that are past date
    const closedSlots = await prisma.timeSlot.updateMany({
        where: {
            status: "AVAILABLE",
            date: { lt: now },
        },
        data: { status: "CANCELLED" },
    })
    results.closedPastSlots = closedSlots.count

    return NextResponse.json({
        ok: true,
        timestamp: now.toISOString(),
        results,
    })
}
