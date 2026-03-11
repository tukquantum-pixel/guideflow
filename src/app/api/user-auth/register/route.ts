import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Nombre, email y contraseña requeridos" }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
        }

        const exists = await prisma.appUser.findUnique({ where: { email } })
        if (exists) {
            return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 })
        }

        const hashed = await bcryptjs.hash(password, 12)
        const user = await prisma.appUser.create({
            data: { name, email, password: hashed },
            select: { id: true, email: true, name: true },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error("[USER_REGISTER]", error)
        return NextResponse.json({ error: "Error al registrar" }, { status: 500 })
    }
}
