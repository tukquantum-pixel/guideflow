import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ trackId: string }> }) {
    const { trackId } = await params
    try {
        const stages = await prisma.stage.findMany({
            where: { trackId },
            include: { photos: { orderBy: { order: "asc" } }, checkpoints: { include: { photos: true }, orderBy: { order: "asc" } } },
            orderBy: { order: "asc" },
        })
        return NextResponse.json(stages)
    } catch { return NextResponse.json([], { status: 500 }) }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ trackId: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "No auth" }, { status: 401 })
    const { trackId } = await params
    try {
        const track = await prisma.track.findUnique({ where: { id: trackId }, include: { activity: { select: { guideId: true } } } })
        if (!track || track.activity.guideId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        const body = await req.json()
        const count = await prisma.stage.count({ where: { trackId } })
        const stage = await prisma.stage.create({
            data: {
                trackId, name: body.name, description: body.description, order: body.order ?? count,
                startPoint: body.startPoint || {}, endPoint: body.endPoint || {},
                distance: body.distance, duration: body.duration,
                elevationGain: body.elevationGain, elevationLoss: body.elevationLoss,
                difficulty: body.difficulty, terrain: body.terrain,
            },
        })
        return NextResponse.json(stage, { status: 201 })
    } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
