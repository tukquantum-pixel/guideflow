import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url)
        const q = url.searchParams.get("q") || ""
        const category = url.searchParams.get("category") || ""
        const maxPrice = url.searchParams.get("maxPrice") ? parseInt(url.searchParams.get("maxPrice")!) : null
        const difficulty = url.searchParams.get("difficulty") || ""

        const guides = await prisma.guide.findMany({
            where: {
                marketplaceEnabled: true,
                deletedAt: null,
                activities: { some: { active: true } },
                ...(q ? {
                    OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { zone: { contains: q, mode: "insensitive" } },
                        { bio: { contains: q, mode: "insensitive" } },
                        { activities: { some: { title: { contains: q, mode: "insensitive" } } } },
                    ],
                } : {}),
            },
            select: {
                slug: true, name: true, avatarUrl: true, zone: true, bio: true,
                certifications: true, yearsExperience: true, languages: true,
                activities: {
                    where: {
                        active: true,
                        ...(category ? { category } : {}),
                        ...(maxPrice ? { priceCents: { lte: maxPrice * 100 } } : {}),
                        ...(difficulty ? { difficulty: difficulty as "LOW" | "MEDIUM" | "HIGH" } : {}),
                    },
                    select: {
                        id: true, title: true, priceCents: true, durationMinutes: true,
                        category: true, difficulty: true, photos: true,
                        _count: { select: { timeSlots: true } },
                    },
                    take: 3,
                    orderBy: { createdAt: "asc" },
                },
                reviews: {
                    select: { rating: true },
                },
            },
            take: 20,
        })

        // Filter out guides with no matching activities (when filters applied)
        const filtered = guides.filter(g => g.activities.length > 0)

        // Calculate average rating
        const results = filtered.map(g => ({
            ...g,
            avgRating: g.reviews.length > 0 ? g.reviews.reduce((s, r) => s + r.rating, 0) / g.reviews.length : null,
            reviewCount: g.reviews.length,
            reviews: undefined,
        }))

        return NextResponse.json(results)
    } catch (error) {
        console.error("[MARKETPLACE_SEARCH]", error)
        return NextResponse.json({ error: "Error de búsqueda" }, { status: 500 })
    }
}
