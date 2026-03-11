import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")

        const bookings = await prisma.booking.findMany({
            where: {
                guideId: session.user.id,
                ...(status ? { status: status as "CONFIRMED" | "CANCELLED" | "COMPLETED" } : {}),
            },
            include: {
                timeSlot: { include: { activity: { select: { title: true } } } },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error("[BOOKINGS_GET] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
