import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const activities = await prisma.activity.findMany({
            where: { guideId: session.user.id },
            include: { _count: { select: { timeSlots: true } } },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(activities)
    } catch (error) {
        console.error("[ACTIVITIES_GET]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const body = await req.json()
        if (!body.title || !body.priceCents || !body.durationMinutes || !body.maxParticipants) {
            return NextResponse.json({ error: "Faltan campos" }, { status: 400 })
        }
        const activity = await prisma.activity.create({
            data: {
                guideId: session.user.id,
                title: body.title,
                description: body.description || "",
                priceCents: Number(body.priceCents),
                durationMinutes: Number(body.durationMinutes),
                maxParticipants: Number(body.maxParticipants),
                category: body.category || "other",
                difficulty: body.difficulty || "MEDIUM",
                meetingPoint: body.meetingPoint || null,
                meetingPointUrl: body.meetingPointUrl || null,
                meetingLat: body.meetingLat ? Number(body.meetingLat) : null,
                meetingLng: body.meetingLng ? Number(body.meetingLng) : null,
                includes: body.includes || null,
                whatToBring: body.whatToBring || null,
                photos: body.photos || [],
            },
        })
        return NextResponse.json(activity, { status: 201 })
    } catch (error) {
        console.error("[ACTIVITIES_POST]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
