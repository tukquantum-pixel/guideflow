import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { minDistToCoords } from "@/lib/haversine"

function parseCoords(geojson: string): number[][] {
    try {
        const geo = JSON.parse(geojson)
        if (geo.type === "FeatureCollection") return geo.features[0]?.geometry?.coordinates || []
        if (geo.type === "Feature") return geo.geometry?.coordinates || []
        if (geo.type === "LineString") return geo.coordinates || []
        return []
    } catch { return [] }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const latA = parseFloat(url.searchParams.get("latA") || "")
        const lonA = parseFloat(url.searchParams.get("lonA") || "")
        const latB = parseFloat(url.searchParams.get("latB") || "")
        const lonB = parseFloat(url.searchParams.get("lonB") || "")

        if ([latA, lonA, latB, lonB].some(isNaN)) {
            return NextResponse.json({ error: "Faltan parámetros: latA, lonA, latB, lonB" }, { status: 400 })
        }

        const tracks = await prisma.track.findMany({
            where: { geojson: { not: null } },
            select: {
                id: true, name: true, distance: true, elevationGain: true, routeType: true,
                activity: { select: { id: true, title: true, category: true } },
            },
        })

        // Load geojson separately to avoid huge memory in select
        const results: Array<{
            id: string; name: string; distance: number | null; elevationGain: number | null
            routeType: string | null; activityId: string; activityTitle: string; category: string
            distA: number; distB: number; totalDist: number
        }> = []

        for (const t of tracks) {
            const full = await prisma.track.findUnique({ where: { id: t.id }, select: { geojson: true } })
            if (!full?.geojson) continue
            const coords = parseCoords(full.geojson)
            if (coords.length === 0) continue

            const distA = minDistToCoords(latA, lonA, coords, 5)
            const distB = minDistToCoords(latB, lonB, coords, 5)
            const MAX_DIST = 15000 // 15km max per point

            if (distA < MAX_DIST && distB < MAX_DIST) {
                results.push({
                    id: t.id, name: t.name, distance: t.distance, elevationGain: t.elevationGain,
                    routeType: t.routeType, activityId: t.activity.id, activityTitle: t.activity.title,
                    category: t.activity.category, distA, distB, totalDist: distA + distB,
                })
            }
        }

        results.sort((a, b) => a.totalDist - b.totalDist)

        return NextResponse.json({
            results: results.slice(0, 5),
            total: results.length,
            pointA: { lat: latA, lon: lonA },
            pointB: { lat: latB, lon: lonB },
        })
    } catch (error) {
        console.error("[ROUTE_SUGGEST] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
