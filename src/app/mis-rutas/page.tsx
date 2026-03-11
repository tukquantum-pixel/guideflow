import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { MisRutasClient } from "./mis-rutas-client"

export const metadata = { title: "Mis Rutas | PATHY" }

export default async function MisRutasPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/mis-rutas")

    const role = (session.user as any).role as string | undefined
    const userName = session.user.name || "Explorador"

    let userId = session.user.id
    let plan = "FREE"

    if (role === "guide") {
        const email = session.user.email
        if (email) {
            let appUser = await prisma.appUser.findUnique({ where: { email } })
            if (!appUser) {
                appUser = await prisma.appUser.create({
                    data: { email, name: userName, plan: "EXPLORER" },
                })
            }
            userId = appUser.id
            plan = appUser.plan
        }
    } else {
        const user = await prisma.appUser.findUnique({ where: { id: userId }, select: { plan: true } })
        plan = user?.plan || "FREE"
    }

    const saved = await prisma.savedRoute.findMany({
        where: { userId },
        include: {
            activity: {
                select: {
                    id: true, title: true, category: true, difficulty: true,
                    priceCents: true, durationMinutes: true, photos: true,
                    track: { select: { distance: true, elevationGain: true, routeType: true } },
                    guide: { select: { name: true, slug: true, avatarUrl: true } },
                },
            },
        },
        orderBy: { savedAt: "desc" },
    })

    // Compute stats from saved routes
    let totalKm = 0, totalElevation = 0, totalMinutes = 0
    saved.forEach(r => {
        if (r.activity.track?.distance) totalKm += r.activity.track.distance / 1000
        if (r.activity.track?.elevationGain) totalElevation += r.activity.track.elevationGain
        totalMinutes += r.activity.durationMinutes || 0
    })

    const stats = {
        totalKm: Math.round(totalKm * 10) / 10,
        totalElevation: Math.round(totalElevation),
        totalHours: Math.round(totalMinutes / 60),
        totalRoutes: saved.length,
    }

    return <MisRutasClient routes={saved} plan={plan} stats={stats} userName={userName} isGuide={role === "guide"} />
}
