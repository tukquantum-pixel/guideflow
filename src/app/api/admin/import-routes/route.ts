import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { fetchHikingRoutes } from "@/lib/osm-client"
import { routeToGpx, routeToGeojson } from "@/lib/gpx-converter"

// Admin-only: import hiking routes from OpenStreetMap
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.email) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

        const admins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim())
        if (!admins.includes(session.user.email)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        const { region, limit = 30 } = await req.json()
        const REGIONS: Record<string, { south: number; west: number; north: number; east: number }> = {
            "pirineos": { south: 42.3, west: -0.8, north: 43.0, east: 1.5 },
            "sierra-nevada": { south: 36.9, west: -3.6, north: 37.2, east: -3.2 },
            "picos-europa": { south: 43.1, west: -5.1, north: 43.3, east: -4.6 },
            "guara": { south: 42.1, west: -0.3, north: 42.4, east: 0.1 },
            "ordesa": { south: 42.55, west: -0.1, north: 42.7, east: 0.15 },
            "montserrat": { south: 41.57, west: 1.73, north: 41.63, east: 1.86 },
            "gredos": { south: 40.15, west: -5.5, north: 40.35, east: -5.0 },
            "moncayo": { south: 41.7, west: -1.92, north: 41.82, east: -1.72 },
        }

        const bbox = REGIONS[region]
        if (!bbox) return NextResponse.json({ error: `Región no válida. Opciones: ${Object.keys(REGIONS).join(", ")}` }, { status: 400 })

        // Ensure system guide exists for community routes
        const SYSTEM_EMAIL = "senderos@PATHY.com"
        let guide = await prisma.guide.findUnique({ where: { email: SYSTEM_EMAIL } })
        if (!guide) {
            guide = await prisma.guide.create({
                data: {
                    email: SYSTEM_EMAIL,
                    name: "Senderos Oficiales",
                    slug: "senderos-oficiales",
                    bio: "Rutas GR, PR y SL de senderos señalizados oficiales. Datos: OpenStreetMap (ODbL).",
                    zone: "España",
                    marketplaceEnabled: true,
                    verificationLevel: "VERIFIED",
                },
            })
        }

        // Fetch routes from OSM
        const routes = await fetchHikingRoutes(bbox, limit)
        let imported = 0

        for (const route of routes) {
            // Skip duplicates by checking title + guide
            const exists = await prisma.activity.findFirst({
                where: { title: route.name, guideId: guide.id },
            })
            if (exists) continue

            const gpxData = routeToGpx(route)
            const geojson = routeToGeojson(route)
            const difficulty = route.distance > 15000 ? "HIGH" : route.distance > 5000 ? "MEDIUM" : "LOW"
            const durationMinutes = Math.round(route.distance / 4000 * 60) // ~4 km/h avg
            const midpoint = route.coordinates[Math.floor(route.coordinates.length / 2)]

            const ref = route.tags.ref || ""
            const desc = route.tags.description || route.tags.note || ""
            const descText = `Sendero oficial ${ref ? `(${ref})` : ""} — ${(route.distance / 1000).toFixed(1)} km. ${desc}. Fuente: OpenStreetMap (ODbL).`.replace(/  +/g, " ").trim()

            await prisma.activity.create({
                data: {
                    guideId: guide.id,
                    title: route.name,
                    description: descText,
                    priceCents: 0,
                    durationMinutes,
                    maxParticipants: 20,
                    category: "senderismo",
                    difficulty: difficulty as "LOW" | "MEDIUM" | "HIGH",
                    meetingLat: route.coordinates[0]?.lat,
                    meetingLng: route.coordinates[0]?.lng,
                    active: true,
                    track: {
                        create: {
                            name: route.name,
                            gpxData,
                            geojson,
                            distance: route.distance,
                            elevationGain: route.elevationGain,
                            durationEst: durationMinutes * 60,
                        },
                    },
                },
            })
            imported++
        }

        return NextResponse.json({
            message: `Importadas ${imported} rutas de "${region}"`,
            total: routes.length,
            imported,
            skipped: routes.length - imported,
            guideSlug: guide.slug,
        })
    } catch (error) {
        console.error("[IMPORT_ROUTES]", error)
        return NextResponse.json({ error: "Error importando rutas" }, { status: 500 })
    }
}
