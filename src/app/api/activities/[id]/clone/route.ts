import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const { id } = await params
        const original = await prisma.activity.findUnique({ where: { id } })
        if (!original || original.guideId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }
        const clone = await prisma.activity.create({
            data: {
                guideId: session.user.id,
                title: `${original.title} (copia)`,
                description: original.description,
                priceCents: original.priceCents,
                durationMinutes: original.durationMinutes,
                maxParticipants: original.maxParticipants,
                category: original.category,
                difficulty: original.difficulty,
                meetingPoint: original.meetingPoint,
                meetingPointUrl: original.meetingPointUrl,
                meetingLat: original.meetingLat,
                meetingLng: original.meetingLng,
                includes: original.includes,
                whatToBring: original.whatToBring,
                photos: original.photos,
                active: false, // starts inactive so guide can review
            },
        })
        return NextResponse.json(clone, { status: 201 })
    } catch (error) {
        console.error("[ACTIVITY_CLONE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
