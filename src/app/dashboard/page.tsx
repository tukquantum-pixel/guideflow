export const dynamic = "force-dynamic"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardContent } from "./dashboard-content"

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const [guide, todayBookings, upcomingBookings, monthRevenue, activityStats] = await Promise.all([
        prisma.guide.findUnique({
            where: { id: session.user.id },
            select: {
                name: true, slug: true, stripeStatus: true, plan: true, avatarUrl: true,
                _count: { select: { activities: true, bookings: true } },
            },
        }),
        // Today's bookings (detailed)
        prisma.booking.findMany({
            where: {
                guideId: session.user.id,
                timeSlot: { date: { gte: today, lt: tomorrow } },
                status: { in: ["CONFIRMED", "PENDING"] },
            },
            select: {
                id: true, customerName: true, customerEmail: true, customerPhone: true,
                numPeople: true, status: true, notes: true,
                timeSlot: { select: { startTime: true, activity: { select: { title: true, category: true } } } },
                payment: { select: { amountCents: true } },
            },
            orderBy: { timeSlot: { startTime: "asc" } },
        }),
        // Upcoming 7 days (for weekly view)
        prisma.booking.findMany({
            where: {
                guideId: session.user.id,
                timeSlot: { date: { gte: tomorrow, lt: weekEnd } },
                status: { in: ["CONFIRMED", "PENDING"] },
            },
            select: {
                id: true, customerName: true, numPeople: true,
                timeSlot: { select: { date: true, startTime: true, activity: { select: { title: true, category: true } } } },
            },
            orderBy: { timeSlot: { date: "asc" } },
        }),
        // Month revenue
        prisma.payment.aggregate({
            where: {
                booking: { guideId: session.user.id },
                status: "SUCCEEDED",
                createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
            },
            _sum: { amountCents: true },
            _count: true,
        }),
        // Activity stats: booking count per activity
        prisma.activity.findMany({
            where: { guideId: session.user.id },
            select: {
                id: true, title: true, category: true,
                _count: { select: { timeSlots: true } },
                timeSlots: {
                    select: { _count: { select: { bookings: true } } },
                },
            },
            orderBy: { createdAt: "asc" },
        }),
    ])

    if (!guide) redirect("/login")

    // Calculate booking counts per activity
    const activityBookingCounts = activityStats.map(a => ({
        title: a.title,
        category: a.category,
        bookings: a.timeSlots.reduce((sum, ts) => sum + ts._count.bookings, 0),
    })).sort((a, b) => b.bookings - a.bookings)

    return (
        <DashboardContent
            guide={guide}
            todayBookings={todayBookings}
            upcomingBookings={upcomingBookings}
            monthStats={{ revenue: monthRevenue._sum.amountCents || 0, count: monthRevenue._count }}
            activityStats={activityBookingCounts}
        />
    )
}
