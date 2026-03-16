import { headers } from "next/headers"
import { userAuth } from "./user-auth"
import { verifyMobileJwt, type MobileJwtPayload } from "./mobile-jwt"

export interface AuthResult {
    id: string
    email: string
    name?: string | null
}

/** Try Bearer JWT first (mobile app), fall back to NextAuth session (web). */
export async function mobileOrSessionAuth(): Promise<AuthResult | null> {
    // 1. Check Bearer token (mobile)
    const h = await headers()
    const authHeader = h.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
        const payload = verifyMobileJwt(authHeader.slice(7))
        if (payload) return { id: payload.id, email: payload.email }
    }

    // 2. Fallback to NextAuth session cookie (web)
    const session = await userAuth()
    if (session?.user?.id) {
        return { id: session.user.id, email: session.user.email ?? "", name: session.user.name }
    }

    return null
}
