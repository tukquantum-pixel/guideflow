import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean)

async function isAdmin() {
    const session = await auth()
    if (!session?.user?.id) return null
    const guide = await prisma.guide.findUnique({ where: { id: session.user.id }, select: { email: true } })
    if (!guide || !ADMIN_EMAILS.includes(guide.email)) return null
    return session.user.id
}

// GET: list credentials with optional status filter
export async function GET(req: NextRequest) {
    try {
        const adminId = await isAdmin()
        if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

        const url = new URL(req.url)
        const status = url.searchParams.get("status") || "PENDING"
        const type = url.searchParams.get("type") || ""

        const credentials = await prisma.credential.findMany({
            where: {
                status: status as "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED",
                ...(type ? { type: type as "TITULO" | "SEGURO" | "LICENCIA" | "EXPERIENCIA" | "IDENTIDAD" } : {}),
            },
            include: {
                guide: { select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true, verificationLevel: true } },
            },
            orderBy: { createdAt: "asc" },
        })

        return NextResponse.json(credentials)
    } catch (error) {
        console.error("[ADMIN_CREDENTIALS_GET]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PUT: approve or reject a credential
export async function PUT(req: NextRequest) {
    try {
        const adminId = await isAdmin()
        if (!adminId) return NextResponse.json({ error: "No autorizado" }, { status: 403 })

        const { credentialId, action, rejectionNote } = await req.json()
        if (!credentialId || !["APPROVED", "REJECTED"].includes(action)) {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
        }

        const credential = await prisma.credential.update({
            where: { id: credentialId },
            data: {
                status: action,
                verifiedAt: action === "APPROVED" ? new Date() : null,
                verifiedBy: adminId,
                rejectionNote: action === "REJECTED" ? (rejectionNote || "Documento no válido") : null,
            },
        })

        // Check if guide should be VERIFIED: needs at least 1 TITULO + 1 SEGURO approved
        if (action === "APPROVED") {
            const approved = await prisma.credential.findMany({
                where: { guideId: credential.guideId, status: "APPROVED" },
                select: { type: true },
            })
            const types = approved.map(c => c.type)
            const hasTitle = types.includes("TITULO")
            const hasInsurance = types.includes("SEGURO")

            if (hasTitle && hasInsurance) {
                await prisma.guide.update({
                    where: { id: credential.guideId },
                    data: { verificationLevel: "VERIFIED", marketplaceEnabled: true },
                })
            }
        }

        return NextResponse.json(credential)
    } catch (error) {
        console.error("[ADMIN_CREDENTIALS_PUT]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
