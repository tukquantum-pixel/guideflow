import { NextResponse } from "next/server"
import { verifyMobileJwt, signMobileJwt } from "@/lib/mobile-jwt"

// POST /api/user-auth/refresh
// Accepts an existing (possibly expired but valid-signature) token and issues a fresh one.
// In production, implement proper refresh token rotation with a DB-stored token.
export async function POST(req: Request) {
    try {
        const { refreshToken } = await req.json()
        if (!refreshToken) {
            return NextResponse.json({ error: "refreshToken requerido" }, { status: 400 })
        }

        // Verify the refresh token (same JWT for now; can be separated later)
        const payload = verifyMobileJwt(refreshToken)
        if (!payload) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
        }

        // Issue new tokens
        const newToken = signMobileJwt({ id: payload.id, email: payload.email, role: "user" })
        const newRefreshToken = signMobileJwt({ id: payload.id, email: payload.email, role: "user" })

        return NextResponse.json({ token: newToken, refreshToken: newRefreshToken })
    } catch (error) {
        console.error("[USER_AUTH_REFRESH]", error)
        return NextResponse.json({ error: "Error al refrescar token" }, { status: 500 })
    }
}
