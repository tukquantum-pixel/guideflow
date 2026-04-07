import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

// POST /api/user/push-token — Register push notification token
export async function POST(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { token, platform } = await req.json()

        if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 })

        // Upsert: update if same user, create if new
        await prisma.appUser.update({
            where: { id: authed.id },
            data: {
                pushToken: token,
                pushPlatform: platform || "unknown",
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[PUSH_TOKEN] Error:", error)
        return NextResponse.json({ error: "Error registrando token" }, { status: 500 })
    }
}
