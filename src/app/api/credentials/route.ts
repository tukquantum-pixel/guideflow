import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const credentials = await prisma.credential.findMany({
            where: { guideId: session.user.id },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(credentials)
    } catch (error) {
        console.error("[CREDENTIALS_GET]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const body = await req.json()
        const { type, name, issuingBody, documentUrl, issueDate, expiryDate, coverageAmount } = body

        if (!type || !name || !documentUrl) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
        }

        const credential = await prisma.credential.create({
            data: {
                guideId: session.user.id,
                type,
                name,
                issuingBody: issuingBody || null,
                documentUrl,
                issueDate: issueDate ? new Date(issueDate) : null,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                coverageAmount: coverageAmount ? parseInt(coverageAmount) : null,
                status: "PENDING",
            },
        })

        // Update guide verification level to PENDING
        await prisma.guide.update({
            where: { id: session.user.id },
            data: { verificationLevel: "PENDING" },
        })

        return NextResponse.json(credential, { status: 201 })
    } catch (error) {
        console.error("[CREDENTIALS_POST]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const url = new URL(req.url)
        const id = url.searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Falta ID" }, { status: 400 })

        await prisma.credential.deleteMany({
            where: { id, guideId: session.user.id },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[CREDENTIALS_DELETE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
