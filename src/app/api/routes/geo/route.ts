import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET /api/routes/geo — Returns routes with geographic coordinates for map rendering
export async function GET() {
    try {
        const tracks = await prisma.track.findMany({
            where: { geojson: { not: null } },
            select: {
                id: true, name: true, distance: true, elevationGain: true, geojson: true,
                routeType: true, durationEst: true, minElevation: true, maxElevation: true,
                activity: {
                    select: {
                        id: true, title: true, category: true, difficulty: true,
                        photos: true, priceCents: true, meetingLat: true, meetingLng: true,
                        guide: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
                    },
                },
            },
        })

        const geoRoutes = tracks.map((t: typeof tracks[number]) => {
            try {
                const geo = JSON.parse(t.geojson!)
                let coords: number[][] = []
                if (geo.type === "FeatureCollection") coords = geo.features[0]?.geometry?.coordinates || []
                else if (geo.type === "Feature") coords = geo.geometry?.coordinates || []
                else if (geo.type === "LineString") coords = geo.coordinates || []

                if (coords.length < 2) return null

                return {
                    id: t.id,
                    activityId: t.activity.id,
                    name: t.name || t.activity.title,
                    distance: t.distance,
                    elevationGain: t.elevationGain,
                    routeType: t.routeType,
                    durationEst: t.durationEst,
                    category: t.activity.category,
                    difficulty: t.activity.difficulty,
                    photo: t.activity.photos[0] || null,
                    priceCents: t.activity.priceCents,
                    guide: t.activity.guide,
                    coordinates: coords,
                    startLat: coords[0][1],
                    startLng: coords[0][0],
                }
            } catch { return null }
        }).filter(Boolean)

        return NextResponse.json({ routes: geoRoutes, total: geoRoutes.length })
    } catch (error) {
        console.error("[ROUTES_GEO] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
