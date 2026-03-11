import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { computeAchievements } from "@/lib/achievements"
import { getCurrentChallenge, computeChallengeProgress } from "@/lib/weekly-challenge"
import { PerfilClient } from "./perfil-client"

export const metadata = { title: "Mi Perfil | PATHY" }

export default async function PerfilPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login?callbackUrl=/perfil")

    const role = (session.user as any).role as string | undefined
    const userName = session.user.name || "Explorador"

    let userId = session.user.id
    let plan = "FREE"
    let avatarUrl: string | null = null
    let memberSince = new Date()

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
            avatarUrl = appUser.avatarUrl
            memberSince = appUser.createdAt
        }
    } else {
        const user = await prisma.appUser.findUnique({ where: { id: userId } })
        plan = user?.plan || "FREE"
        avatarUrl = user?.avatarUrl || null
        memberSince = user?.createdAt || new Date()
    }

    const saved = await prisma.savedRoute.findMany({
        where: { userId },
        include: {
            activity: {
                select: {
                    id: true, title: true, category: true, difficulty: true,
                    durationMinutes: true,
                    track: { select: { distance: true, elevationGain: true } },
                },
            },
        },
        orderBy: { savedAt: "desc" },
    })

    // Compute stats
    let totalKm = 0, totalElevation = 0, totalMinutes = 0
    let longestRoute = { title: "", km: 0 }
    let highestElevation = { title: "", m: 0 }

    saved.forEach(r => {
        const dist = r.activity.track?.distance ? r.activity.track.distance / 1000 : 0
        const elev = r.activity.track?.elevationGain || 0
        totalKm += dist
        totalElevation += elev
        totalMinutes += r.activity.durationMinutes || 0
        if (dist > longestRoute.km) longestRoute = { title: r.activity.title, km: Math.round(dist * 10) / 10 }
        if (elev > highestElevation.m) highestElevation = { title: r.activity.title, m: Math.round(elev) }
    })

    // Monthly progress (last 6 months)
    const now = new Date()
    const monthlyKm: { month: string; km: number }[] = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = d.toLocaleDateString("es-ES", { month: "short" })
        const km = saved
            .filter(r => {
                const sd = new Date(r.savedAt)
                return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear()
            })
            .reduce((sum, r) => sum + (r.activity.track?.distance ? r.activity.track.distance / 1000 : 0), 0)
        monthlyKm.push({ month: label, km: Math.round(km * 10) / 10 })
    }

    const recentRoutes = saved.slice(0, 5).map(r => ({
        id: r.activity.id, title: r.activity.title, category: r.activity.category,
        km: r.activity.track?.distance ? Math.round(r.activity.track.distance / 100) / 10 : 0,
        date: r.savedAt.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
    }))

    const computedStats = { totalKm: Math.round(totalKm * 10) / 10, totalElevation: Math.round(totalElevation), totalHours: Math.round(totalMinutes / 60), totalRoutes: saved.length }
    const achievements = computeAchievements(computedStats)

    // Weekly stats for challenge
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weeklyRoutes = saved.filter(r => new Date(r.savedAt) >= weekStart)
    const weeklyKm = weeklyRoutes.reduce((s, r) => s + (r.activity.track?.distance ? r.activity.track.distance / 1000 : 0), 0)
    const weeklyElev = weeklyRoutes.reduce((s, r) => s + (r.activity.track?.elevationGain || 0), 0)
    const challenge = getCurrentChallenge()
    const challengeProgress = computeChallengeProgress(challenge, { km: weeklyKm, elevation: weeklyElev, routes: weeklyRoutes.length })

    return (
        <PerfilClient
            userName={userName}
            avatarUrl={avatarUrl}
            plan={plan}
            memberSince={memberSince.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            stats={computedStats}
            records={{ longestRoute, highestElevation }}
            monthlyKm={monthlyKm}
            recentRoutes={recentRoutes}
            achievements={achievements}
            challenge={{ ...challenge, ...challengeProgress }}
            isGuide={role === "guide"}
        />
    )
}
