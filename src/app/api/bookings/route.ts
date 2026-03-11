import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

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

            return newBooking
        })

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error("[BOOKING_POST] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
