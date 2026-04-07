import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { timeSlotId, customerName, customerEmail, customerPhone, numPeople, notes } = body

        if (!timeSlotId || !customerName || !customerEmail) {
            return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
        }

        const slot = await prisma.timeSlot.findUnique({
            where: { id: timeSlotId },
            include: { activity: true },
        })

        if (!slot || slot.status !== "AVAILABLE") {
            return NextResponse.json({ error: "Horario no disponible" }, { status: 400 })
        }

        const people = Number(numPeople) || 1
        if (people > slot.spotsRemaining) {
            return NextResponse.json(
                { error: `Solo quedan ${slot.spotsRemaining} plazas` },
                { status: 400 }
            )
        }

        const booking = await prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    timeSlotId,
                    guideId: slot.activity.guideId,
                    customerName,
                    customerEmail,
                    customerPhone: customerPhone || null,
                    numPeople: people,
                    notes: notes || null,
                    status: "CONFIRMED",
                },
            })

            const remaining = slot.spotsRemaining - people
            await tx.timeSlot.update({
                where: { id: timeSlotId },
                data: {
                    spotsRemaining: remaining,
                    status: remaining <= 0 ? "FULL" : "AVAILABLE",
                },
            })

            // Create payment record
            const amountCents = slot.activity.priceCents * people
            await tx.payment.create({
                data: {
                    bookingId: newBooking.id,
                    amountCents,
                    platformFeeCents: Math.round(amountCents * 0.10),
                    status: "PENDING",
                },
            })

            return newBooking
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error("[BOOKING_POST] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// GET — List bookings for the authenticated user/guide
export async function GET() {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        // Check if guide first
        const guide = await prisma.guide.findUnique({ where: { id: authed.id } })
        if (guide) {
            const bookings = await prisma.booking.findMany({
                where: { guideId: authed.id },
                include: {
                    timeSlot: { include: { activity: { select: { id: true, title: true, priceCents: true, photos: true } } } },
                    payment: true,
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            })
            return NextResponse.json({ bookings, total: bookings.length, role: "guide" })
        }

        // Regular user: match by email
        const user = await prisma.appUser.findUnique({ where: { id: authed.id } })
        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

        const bookings = await prisma.booking.findMany({
            where: { customerEmail: user.email },
            include: {
                timeSlot: { include: { activity: { select: { id: true, title: true, priceCents: true, photos: true } } } },
                payment: true,
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ bookings, total: bookings.length, role: "user" })
    } catch (error) {
        console.error("[BOOKINGS_GET] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

