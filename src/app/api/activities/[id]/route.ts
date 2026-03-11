import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { id } = await params
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: { guide: { select: { name: true, slug: true } }, timeSlots: true },
        })
        if (!activity) return NextResponse.json({ error: "No encontrada" }, { status: 404 })
        return NextResponse.json(activity)
    } catch (error) {
        console.error("[ACTIVITY_GET]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const { id } = await params
        const existing = await prisma.activity.findUnique({ where: { id } })
        if (!existing || existing.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }
        const body = await req.json()
        const updated = await prisma.activity.update({
            where: { id },
            data: {
                title: body.title ?? existing.title,
                description: body.description ?? existing.description,
                priceCents: body.priceCents != null ? Number(body.priceCents) : existing.priceCents,
                durationMinutes: body.durationMinutes != null ? Number(body.durationMinutes) : existing.durationMinutes,
                maxParticipants: body.maxParticipants != null ? Number(body.maxParticipants) : existing.maxParticipants,
                category: body.category ?? existing.category,
                difficulty: body.difficulty ?? existing.difficulty,
                meetingPoint: body.meetingPoint ?? existing.meetingPoint,
                meetingLat: body.meetingLat !== undefined ? (body.meetingLat ? Number(body.meetingLat) : null) : existing.meetingLat,
                meetingLng: body.meetingLng !== undefined ? (body.meetingLng ? Number(body.meetingLng) : null) : existing.meetingLng,
                includes: body.includes ?? existing.includes,
                whatToBring: body.whatToBring ?? existing.whatToBring,
                photos: body.photos ?? existing.photos,
                active: body.active ?? existing.active,
            },
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error("[ACTIVITY_PUT]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const { id } = await params
        const existing = await prisma.activity.findUnique({ where: { id } })
        if (!existing || existing.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }
        await prisma.activity.delete({ where: { id } })
        return NextResponse.json({ deleted: true })
    } catch (error) {
        console.error("[ACTIVITY_DELETE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
