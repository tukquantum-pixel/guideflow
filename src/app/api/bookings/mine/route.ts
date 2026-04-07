import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

// GET /api/bookings/mine — Bookings for the authenticated user (mobile + web)
export async function GET(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")

        // Try as Guide first
        const guide = await prisma.guide.findUnique({ where: { id: authed.id } })
        if (guide) {
            const bookings = await prisma.booking.findMany({
                where: {
                    guideId: authed.id,
                    ...(status ? { status: status as "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PENDING" } : {}),
                },
                include: {
                    timeSlot: { include: { activity: { select: { id: true, title: true, priceCents: true, photos: true } } } },
                    payment: true,
                },
                orderBy: { createdAt: "desc" },
            })
            return NextResponse.json({ bookings, total: bookings.length, role: "guide" })
        }

        // AppUser: find by email
        const user = await prisma.appUser.findUnique({ where: { id: authed.id } })
        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

        const bookings = await prisma.booking.findMany({
            where: {
                customerEmail: user.email,
                ...(status ? { status: status as "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PENDING" } : {}),
            },
            include: {
                timeSlot: {
                    include: {
                        activity: {
                            select: {
                                id: true, title: true, priceCents: true, photos: true,
                                category: true, difficulty: true, durationMinutes: true,
                                meetingPoint: true,
                                guide: { select: { id: true, name: true, avatarUrl: true, phone: true } },
                            },
                        },
                    },
                },
                payment: true,
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({
            bookings: bookings.map((b) => ({
                id: b.id, status: b.status, numPeople: b.numPeople,
                notes: b.notes, createdAt: b.createdAt,
                date: b.timeSlot.date, startTime: b.timeSlot.startTime,
                activity: b.timeSlot.activity,
                payment: b.payment ? { amountCents: b.payment.amountCents, status: b.payment.status } : null,
            })),
            total: bookings.length,
            role: "user",
        })
    } catch (error) {
        console.error("[BOOKINGS_MINE] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
