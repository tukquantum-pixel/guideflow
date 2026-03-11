import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@/lib/storage"

export async function POST(req: NextRequest, { params }: { params: Promise<{ stageId: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: "No auth" }, { status: 401 })
    const { stageId } = await params
    try {
        const stage = await prisma.stage.findUnique({ where: { id: stageId }, include: { track: { include: { activity: { select: { guideId: true } } } } } })
        if (!stage || stage.track.activity.guideId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

        const formData = await req.formData()
        const file = formData.get("photo") as File | null
        const caption = formData.get("caption") as string | null
        const checkpointId = formData.get("checkpointId") as string | null

        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
        const ext = file.name.split(".").pop() || "jpg"
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await uploadFile(buffer, `stages/${stageId}`, file.type, ext)

        if (checkpointId) {
            const photo = await prisma.checkpointPhoto.create({ data: { checkpointId, url, caption, order: 0 } })
            return NextResponse.json(photo, { status: 201 })
        }
        const photo = await prisma.stagePhoto.create({ data: { stageId, url, caption, order: 0 } })
        return NextResponse.json(photo, { status: 201 })
    } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
