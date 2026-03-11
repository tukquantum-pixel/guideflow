import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const slots = await prisma.timeSlot.findMany({
            where: { activityId: id, date: { gte: new Date() } },
            orderBy: { date: "asc" },
        })

        return NextResponse.json(slots)
    } catch (error) {
        console.error("[SLOTS_GET] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: Params) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        }

        const { id } = await params
        const activity = await prisma.activity.findUnique({ where: { id } })

        if (!activity || activity.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        const body = await req.json()
        const { date, startTime } = body

        if (!date || !startTime) {
            return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
        }

        const slot = await prisma.timeSlot.create({
            data: {
                activityId: id,
                date: new Date(date),
                startTime,
                spotsRemaining: activity.maxParticipants,
            },
        })

        return NextResponse.json(slot, { status: 201 })
    } catch (error) {
        console.error("[SLOTS_POST] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
