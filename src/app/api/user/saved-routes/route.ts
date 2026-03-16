import { NextRequest, NextResponse } from "next/server"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"
import { prisma } from "@/lib/db"

async function resolveUserId(session: any): Promise<string | null> {
    if (!session?.user?.id) return null
    const role = session.user.role as string | undefined
    if (role !== "guide") return session.user.id

    // Guide: find or create matching AppUser
    const email = session.user.email as string | undefined
    if (!email) return null
    let appUser = await prisma.appUser.findUnique({ where: { email } })
    if (!appUser) {
        appUser = await prisma.appUser.create({
            data: { email, name: session.user.name || "Guía", plan: "EXPLORER" },
        })
    }
    return appUser.id
}

export async function GET() {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const userId = authed.id

        const saved = await prisma.savedRoute.findMany({
            where: { userId },
            include: {
                activity: {
                    select: {
                        id: true, title: true, category: true, difficulty: true,
                        priceCents: true, durationMinutes: true, photos: true,
                        meetingLat: true, meetingLng: true,
                        track: { select: { distance: true, elevationGain: true } },
                        guide: { select: { name: true, slug: true, avatarUrl: true } },
                    },
                },
            },
            orderBy: { savedAt: "desc" },
        })
        return NextResponse.json(saved)
    } catch (error) {
        console.error("[SAVED_ROUTES_GET]", error)
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const userId = authed.id

        const user = await prisma.appUser.findUnique({ where: { id: userId }, select: { plan: true } })
        // FREE: up to 5 saved routes; EXPLORER/PEAK: unlimited
        if (user?.plan === "FREE") {
            const count = await prisma.savedRoute.count({ where: { userId } })
            if (count >= 5) return NextResponse.json({ error: "Límite de 5 rutas guardadas. Actualiza a Explorer para guardar sin límites" }, { status: 403 })
        }

        const { activityId, notes } = await req.json()
        const saved = await prisma.savedRoute.create({ data: { userId, activityId, notes } })
        return NextResponse.json(saved, { status: 201 })
    } catch (error) {
        console.error("[SAVED_ROUTES_POST]", error)
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
        const userId = authed.id

        const { activityId } = await req.json()
        await prisma.savedRoute.delete({ where: { userId_activityId: { userId, activityId } } })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("[SAVED_ROUTES_DELETE]", error)
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
