import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { ActivityList } from "./activity-list"

export default async function ActivitiesPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const activities = await prisma.activity.findMany({
        where: { guideId: session.user.id },
        include: {
            _count: { select: { timeSlots: true } },
            timeSlots: { select: { _count: { select: { bookings: true } }, bookings: { where: { status: { not: "CANCELLED" } }, select: { numPeople: true } } } },
        },
        orderBy: { createdAt: "desc" },
    })

    // Calculate booking stats per activity
    const enriched = activities.map(a => ({
        ...a,
        bookingCount: a.timeSlots.reduce((s, ts) => s + ts._count.bookings, 0),
        totalPax: a.timeSlots.reduce((s, ts) => s + ts.bookings.reduce((ss, b) => ss + b.numPeople, 0), 0),
        timeSlots: undefined, // don't pass raw timeSlots to client
    }))

    return <ActivityList activities={enriched} />
}
