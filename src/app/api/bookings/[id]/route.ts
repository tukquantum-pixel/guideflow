import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

type Params = { params: Promise<{ id: string }> }

// POST /api/bookings/[id] — Update booking status (Pathyapp uses POST)
export async function POST(req: NextRequest, { params }: Params) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { id } = await params
        const body = await req.json()
        const { status } = body

        if (!["CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
            return NextResponse.json({ error: "Estado no válido" }, { status: 400 })
        }

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { timeSlot: true },
        })
        if (!booking) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })

        // Authorization
        const isGuide = booking.guideId === authed.id
        const user = await prisma.appUser.findUnique({ where: { id: authed.id } })
        const isCustomer = user && booking.customerEmail === user.email
        if (!isGuide && !isCustomer) return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        if (isCustomer && !isGuide && status !== "CANCELLED") {
            return NextResponse.json({ error: "Solo puedes cancelar tu reserva" }, { status: 403 })
        }

        if (status === "CANCELLED" && booking.status !== "CANCELLED") {
            await prisma.$transaction(async (tx) => {
                await tx.booking.update({ where: { id }, data: { status: "CANCELLED" } })
                await tx.timeSlot.update({
                    where: { id: booking.timeSlotId },
                    data: { spotsRemaining: { increment: booking.numPeople }, status: "AVAILABLE" },
                })
                await tx.payment.updateMany({ where: { bookingId: id }, data: { status: "REFUNDED" } })
            })
        } else {
            await prisma.booking.update({ where: { id }, data: { status } })
        }

        return NextResponse.json({ id, status, message: "Reserva actualizada" })
    } catch (error) {
        console.error("[BOOKING_UPDATE] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PATCH — Legacy endpoint (web dashboard compatibility)
export async function PATCH(req: NextRequest, { params }: Params) {
    return POST(req, { params })
}

// GET /api/bookings/[id] — Booking detail
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { id } = await params
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                timeSlot: {
                    include: {
                        activity: {
                            select: {
                                id: true, title: true, priceCents: true, photos: true,
                                category: true, difficulty: true, durationMinutes: true,
                                meetingPoint: true, meetingLat: true, meetingLng: true,
                                guide: { select: { id: true, name: true, avatarUrl: true, phone: true } },
                            },
                        },
                    },
                },
                payment: true,
            },
        })

        if (!booking) return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })

        const isGuide = booking.guideId === authed.id
        const user = await prisma.appUser.findUnique({ where: { id: authed.id } })
        const isCustomer = user && booking.customerEmail === user.email
        if (!isGuide && !isCustomer) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

        return NextResponse.json(booking)
    } catch (error) {
        console.error("[BOOKING_DETAIL] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
