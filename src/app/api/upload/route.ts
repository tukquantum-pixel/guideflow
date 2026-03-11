import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"]

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const formData = await req.formData()
        const file = formData.get("file") as File | null
        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
        if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Solo JPG, PNG o WebP" }, { status: 400 })
        if (file.size > MAX_SIZE) return NextResponse.json({ error: "Máximo 5MB" }, { status: 400 })

        await mkdir(UPLOAD_DIR, { recursive: true })
        const ext = file.name.split(".").pop() || "jpg"
        const filename = `${session.user.id}-${randomUUID().slice(0, 8)}.${ext}`
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(path.join(UPLOAD_DIR, filename), buffer)

        return NextResponse.json({ url: `/uploads/${filename}` })
    } catch (error) {
        console.error("[UPLOAD]", error)
        return NextResponse.json({ error: "Error al subir" }, { status: 500 })
    }
}
