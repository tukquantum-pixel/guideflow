import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { BookingsList } from "./bookings-list"

export default async function BookingsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const bookings = await prisma.booking.findMany({
        where: { guideId: session.user.id },
        include: {
            timeSlot: { include: { activity: { select: { title: true, priceCents: true, category: true } } } },
            payment: { select: { amountCents: true, status: true } },
        },
        orderBy: { timeSlot: { date: "desc" } },
    })

    return <BookingsList bookings={bookings} />
}
