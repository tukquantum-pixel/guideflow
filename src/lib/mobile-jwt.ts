import jwt from "jsonwebtoken"

const SECRET = process.env.MOBILE_JWT_SECRET || process.env.AUTH_SECRET
if (!SECRET) throw new Error("MOBILE_JWT_SECRET or AUTH_SECRET must be set. JWT authentication cannot work without a secret.")

export interface MobileJwtPayload {
    id: string
    email: string
    role: "user"
}

export function signMobileJwt(payload: MobileJwtPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export function verifyMobileJwt(token: string): MobileJwtPayload | null {
    try {
        return jwt.verify(token, SECRET) as MobileJwtPayload
    } catch {
        return null
    }
}
