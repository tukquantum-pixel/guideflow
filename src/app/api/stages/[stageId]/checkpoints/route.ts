import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ stageId: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "No auth" }, { status: 401 })
    const { stageId } = await params
    try {
        const stage = await prisma.stage.findUnique({ where: { id: stageId }, include: { track: { include: { activity: { select: { guideId: true } } } } } })
        if (!stage || stage.track.activity.guideId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        const body = await req.json()
        const count = await prisma.checkpoint.count({ where: { stageId } })
        const cp = await prisma.checkpoint.create({
            data: {
                stageId, name: body.name, type: body.type || "viewpoint",
                lat: body.lat, lng: body.lng, elevation: body.elevation,
                description: body.description, order: body.order ?? count,
                timeFromStart: body.timeFromStart,
            },
        })
        return NextResponse.json(cp, { status: 201 })
    } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
