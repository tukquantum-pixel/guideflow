export interface TodayBooking {
    id: string; customerName: string; customerEmail: string; customerPhone: string | null
    numPeople: number; status: string; notes: string | null
    timeSlot: { startTime: string; activity: { title: string; category: string } }
    payment: { amountCents: number } | null
}

export interface UpcomingBooking {
    id: string; customerName: string; numPeople: number
    timeSlot: { date: Date | string; startTime: string; activity: { title: string; category: string } }
}

export interface ActivityStat { title: string; category: string; bookings: number }

export interface GuideData {
    name: string; slug: string; stripeStatus: string; plan: string; avatarUrl: string | null
    _count: { activities: number; bookings: number }
}

export interface MonthStats { revenue: number; count: number }

export const CAT_ICONS: Record<string, string> = {
    hiking: "🥾", climbing: "🧗", biking: "🚵", kayak: "🏊", ski: "🎿", camping: "🏕️", other: "🧭",
}
