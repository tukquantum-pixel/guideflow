import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { SlotManager } from "./slot-manager"

type Params = { params: Promise<{ id: string }> }

export default async function ActivityDetailPage({ params }: Params) {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const { id } = await params

    const activity = await prisma.activity.findUnique({
        where: { id, guideId: session.user.id },
        include: {
            timeSlots: {
                where: { date: { gte: new Date() } },
                orderBy: { date: "asc" },
                include: { _count: { select: { bookings: true } } },
            },
        },
    })

    if (!activity) redirect("/dashboard/activities")

    return <SlotManager activity={activity} />
}
