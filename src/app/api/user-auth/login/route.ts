import { NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { prisma } from "@/lib/db"
import { signMobileJwt } from "@/lib/mobile-jwt"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"

// POST /api/user-auth/login
// Mobile-friendly login: returns JWT token for Bearer auth
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
        }

        const rl = checkRateLimit(`user-login:${email}`)
        if (!rl.allowed) {
            return NextResponse.json({ error: "Demasiados intentos. Espera 15 minutos" }, { status: 429 })
        }

        const user = await prisma.appUser.findUnique({ where: { email } })
        if (!user?.password) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
        }

        const valid = await bcryptjs.compare(password, user.password)
        if (!valid) {
            return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 })
        }

        resetRateLimit(`user-login:${email}`)

        const token = signMobileJwt({ id: user.id, email: user.email, role: "user" })

        return NextResponse.json({
            user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, plan: user.plan },
            token,
        })
    } catch (error) {
        console.error("[USER_LOGIN]", error)
        return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
    }
}
