import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function extractEndpoints(geojson: string): { start: number[]; end: number[] } | null {
    try {
        const geo = JSON.parse(geojson)
        let coords: number[][] = []
        if (geo.type === "FeatureCollection") coords = geo.features[0]?.geometry?.coordinates || []
        else if (geo.type === "Feature") coords = geo.geometry?.coordinates || []
        else if (geo.type === "LineString") coords = geo.coordinates || []
        if (coords.length < 2) return null
        return { start: [coords[0][1], coords[0][0]], end: [coords[coords.length - 1][1], coords[coords.length - 1][0]] }
    } catch { return null }
}

export async function GET() {
    try {
        const tracks = await prisma.track.findMany({
            where: { geojson: { not: null } },
            select: {
                id: true, name: true, distance: true, elevationGain: true, routeType: true, geojson: true,
                activity: { select: { id: true, title: true, category: true, difficulty: true } },
            },
        })

        const routes = tracks.map(t => {
            const ep = extractEndpoints(t.geojson!)
            return ep ? {
                id: t.id, name: t.name, distance: t.distance, elevationGain: t.elevationGain,
                routeType: t.routeType, activityId: t.activity.id, activityTitle: t.activity.title,
                category: t.activity.category, difficulty: t.activity.difficulty,
                lat: ep.start[0], lng: ep.start[1], endLat: ep.end[0], endLng: ep.end[1],
            } : null
        }).filter(Boolean)

        return NextResponse.json({ routes, total: routes.length })
    } catch (error) {
        console.error("[ROUTES_ALL] Error:", error)
        return NextResponse.json({ error: "Error interno" }, { status: 500 })
    }
}
