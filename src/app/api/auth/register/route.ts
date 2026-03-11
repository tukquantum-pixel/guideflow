import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/db"
import { generateUniqueSlug } from "@/lib/slug"

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            )
        }

        const exists = await prisma.guide.findUnique({
            where: { email },
        })

        if (exists) {
            return NextResponse.json(
                { error: "Ya existe una cuenta con este email" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcryptjs.hash(password, 12)
        const slug = await generateUniqueSlug(name)

        const guide = await prisma.guide.create({
            data: { name, email, password: hashedPassword, slug },
        })

        return NextResponse.json(
            { id: guide.id, slug: guide.slug },
            { status: 201 }
        )
    } catch (error) {
        console.error("[REGISTER] Error:", error)
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        )
    }
}
