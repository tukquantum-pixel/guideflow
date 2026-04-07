export const dynamic = "force-dynamic"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { GuideProfile } from "./guide-profile"

type Params = { params: Promise<{ slug: string }> }

export default async function PublicGuidePage({ params }: Params) {
    const { slug } = await params

    const guide = await prisma.guide.findUnique({
        where: { slug },
        select: {
            name: true,
            slug: true,
            bio: true,
            avatarUrl: true,
            zone: true,
            phone: true,
            email: true,
            certifications: true,
            yearsExperience: true,
            languages: true,
            verificationLevel: true,
            credentials: {
                where: { status: "APPROVED" },
                select: { type: true, name: true, issuingBody: true, coverageAmount: true, expiryDate: true },
                orderBy: { createdAt: "desc" },
            },
            reviews: {
                where: { verified: true },
                select: { id: true, rating: true, comment: true, clientName: true, createdAt: true },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            activities: {
                where: { active: true },
                select: {
                    id: true, title: true, description: true, priceCents: true,
                    durationMinutes: true, maxParticipants: true, category: true,
                    difficulty: true, meetingPoint: true, meetingLat: true,
                    meetingLng: true, includes: true, whatToBring: true, photos: true,
                    track: { select: { geojson: true, distance: true, elevationGain: true, durationEst: true } },
                    timeSlots: {
                        where: { date: { gte: new Date() }, status: "AVAILABLE" },
                        orderBy: { date: "asc" },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!guide) notFound()

    const mapped = {
        ...guide,
        reviews: guide.reviews.map(r => ({ ...r, date: r.createdAt.toISOString() })),
    }

    return <GuideProfile guide={mapped as any} />
}
