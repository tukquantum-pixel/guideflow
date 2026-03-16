import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

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
