import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        }

        const { id } = await params
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { timeSlot: true },
        })

        if (!booking || booking.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        if (booking.status === "CANCELLED") {
            return NextResponse.json({ error: "Ya está cancelada" }, { status: 400 })
        }

        await prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: { id },
                data: { status: "CANCELLED" },
            })

            await tx.timeSlot.update({
                where: { id: booking.timeSlotId },
                data: {
                    spotsRemaining: { increment: booking.numPeople },
                    status: "AVAILABLE",
                },
            })
        })

        return NextResponse.json({ cancelled: true })
    } catch (error) {
        console.error("[BOOKING_CANCEL] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
