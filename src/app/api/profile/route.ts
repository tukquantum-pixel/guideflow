import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const guide = await prisma.guide.findUnique({
            where: { id: session.user.id },
            select: { name: true, slug: true, bio: true, zone: true, avatarUrl: true, phone: true, languages: true, certifications: true, yearsExperience: true, serviceRadius: true, marketplaceEnabled: true },
        })
        return NextResponse.json(guide)
    } catch (error) {
        console.error("[PROFILE_GET]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const body = await req.json()
        const updated = await prisma.guide.update({
            where: { id: session.user.id },
            data: {
                name: body.name || undefined,
                bio: body.bio ?? undefined,
                zone: body.zone ?? undefined,
                phone: body.phone ?? undefined,
                languages: body.languages ?? undefined,
                avatarUrl: body.avatarUrl ?? undefined,
                certifications: body.certifications ?? undefined,
                yearsExperience: body.yearsExperience !== undefined ? (body.yearsExperience ? parseInt(body.yearsExperience) : null) : undefined,
                serviceRadius: body.serviceRadius !== undefined ? (body.serviceRadius ? parseFloat(body.serviceRadius) : null) : undefined,
                marketplaceEnabled: body.marketplaceEnabled ?? undefined,
            },
        })
        return NextResponse.json(updated)
    } catch (error) {
        console.error("[PROFILE_PUT]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
