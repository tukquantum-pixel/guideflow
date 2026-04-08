import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

// Helper: get authenticated user (guide or app user)
async function getAuthUser() {
    // 1. Try guide session first
    const session = await auth()
    if (session?.user?.id) {
        return { id: session.user.id, email: session.user.email ?? "", role: (session.user as any).role }
    }
    // 2. Fallback to mobile/app user session
    const authed = await mobileOrSessionAuth()
    if (authed) return { id: authed.id, email: authed.email, role: "user" }
    return null
}

// GET /api/user/profile — AppUser profile (NOT Guide)
export async function GET() {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const user = await prisma.appUser.findUnique({
            where: { id: authed.id },
            select: {
                id: true, name: true, email: true, avatarUrl: true, plan: true, createdAt: true,
                _count: { select: { recordedRoutes: true, savedRoutes: true } },
            },
        })

        if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

        // Aggregate stats from recorded routes
        const stats = await prisma.recordedRoute.aggregate({
            where: { userId: authed.id },
            _sum: { distance: true, elevationGain: true, duration: true },
        })

        return NextResponse.json({
            ...user,
            stats: {
                totalDistance: stats._sum.distance || 0,
                totalElevation: stats._sum.elevationGain || 0,
                totalDuration: stats._sum.duration || 0,
                routeCount: user._count.recordedRoutes,
                savedCount: user._count.savedRoutes,
            },
        })
    } catch (error) {
        console.error("[USER_PROFILE]", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}

// PATCH /api/user/profile — Update profile (Guide or AppUser)
export async function PATCH(req: Request) {
    try {
        const authed = await getAuthUser()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const body = await req.json()
        const { name, avatarUrl } = body

        const updatedData: any = {}
        if (name !== undefined) updatedData.name = name
        if (avatarUrl !== undefined) updatedData.avatarUrl = avatarUrl

        if (Object.keys(updatedData).length === 0) {
            return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 })
        }

        // Update Guide if role is guide
        if (authed.role === "guide") {
            const guide = await prisma.guide.update({
                where: { id: authed.id },
                data: updatedData,
                select: { id: true, name: true, avatarUrl: true }
            })
            // Also update linked AppUser if exists
            if (authed.email) {
                await prisma.appUser.updateMany({ where: { email: authed.email }, data: updatedData }).catch(() => {})
            }
            return NextResponse.json(guide)
        }

        // Update AppUser
        const user = await prisma.appUser.update({
            where: { id: authed.id },
            data: updatedData,
            select: { id: true, name: true, avatarUrl: true }
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("[USER_PROFILE_PATCH]", error)
        return NextResponse.json({ error: "Error interno al actualizar" }, { status: 500 })
    }
}
