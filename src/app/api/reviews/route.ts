import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { mobileOrSessionAuth } from "@/lib/mobile-or-session-auth"

// POST /api/reviews — Create a review
export async function POST(req: NextRequest) {
    try {
        const authed = await mobileOrSessionAuth()
        if (!authed) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const { guideId, bookingId, rating, comment } = await req.json()

        if (!guideId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "guideId y rating (1-5) requeridos" }, { status: 400 })
        }

        // Check if user already reviewed this guide
        const existing = await prisma.review.findFirst({
            where: { guideId, clientEmail: authed.email },
        })
        if (existing) {
            return NextResponse.json({ error: "Ya has valorado a este guía" }, { status: 409 })
        }

        const review = await prisma.review.create({
            data: {
                guideId,
                clientName: authed.name || "Anónimo",
                clientEmail: authed.email,
                rating,
                comment: comment || null,
            },
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        console.error("[REVIEWS] POST Error:", error)
        return NextResponse.json({ error: "Error creando review" }, { status: 500 })
    }
}

// GET /api/reviews?guideId=&page=
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const guideId = searchParams.get("guideId")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = 10

        if (!guideId) return NextResponse.json({ error: "guideId requerido" }, { status: 400 })

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { guideId },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.review.count({ where: { guideId } }),
        ])

        // Compute averages
        const agg = await prisma.review.aggregate({
            where: { guideId },
            _avg: { rating: true },
            _count: true,
        })

        return NextResponse.json({
            reviews,
            total,
            page,
            pages: Math.ceil(total / limit),
            avgRating: agg._avg.rating || 0,
            totalReviews: agg._count,
        })
    } catch (error) {
        console.error("[REVIEWS] GET Error:", error)
        return NextResponse.json({ error: "Error obteniendo reviews" }, { status: 500 })
    }
}
