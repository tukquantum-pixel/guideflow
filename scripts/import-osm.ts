// Standalone script — run with: npx tsx scripts/import-osm.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const OVERPASS_API = "https://overpass-api.de/api/interpreter"

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

async function main() {
    const regions = process.argv.slice(2)
    const toImport = regions.length > 0 ? regions : Object.keys(REGIONS)

    // Create system guide
    const SYSTEM_EMAIL = "comunidad@guideflow.com"
    let guide = await prisma.guide.findUnique({ where: { email: SYSTEM_EMAIL } })
    if (!guide) {
        guide = await prisma.guide.create({
            data: {
                email: SYSTEM_EMAIL, name: "Rutas de la Comunidad", slug: "comunidad",
                bio: "Rutas importadas de OpenStreetMap — datos abiertos de la comunidad (ODbL)",
                zone: "España", marketplaceEnabled: true, verificationLevel: "VERIFIED",
            },
        })
        console.log("✅ Guía sistema creado: /comunidad")
    }

    let totalImported = 0
    for (const region of toImport) {
        const bbox = REGIONS[region]
        if (!bbox) { console.log(`⚠️ Región "${region}" no válida, saltando...`); continue }

        console.log(`\n🔄 Importando "${region}"...`)
        try {
            const routes = await fetchRoutes(bbox, 40)
            console.log(`   📡 Overpass devolvió ${routes.length} rutas`)

            let imported = 0
            for (const r of routes) {
                const exists = await prisma.activity.findFirst({ where: { title: r.name, guideId: guide.id } })
                if (exists) { continue }

                const difficulty = r.distance > 15000 ? "HIGH" : r.distance > 5000 ? "MEDIUM" : "LOW"
                const durMin = Math.round(r.distance / 4000 * 60)

                await prisma.activity.create({
                    data: {
                        guideId: guide.id, title: r.name,
                        description: `Ruta de senderismo — ${(r.distance / 1000).toFixed(1)} km. Datos: OpenStreetMap (ODbL).`,
                        priceCents: 0, durationMinutes: durMin, maxParticipants: 20,
                        category: "senderismo", difficulty, active: true,
                        meetingLat: r.coords[0]?.lat, meetingLng: r.coords[0]?.lng,
                        track: {
                            create: {
                                name: r.name,
                                gpxData: toGpx(r),
                                geojson: toGeojson(r),
                                distance: r.distance,
                                elevationGain: 0,
                                durationEst: durMin * 60,
                            },
                        },
                    },
                })
                imported++
            }
            console.log(`   ✅ ${region}: ${imported} importadas, ${routes.length - imported} duplicadas`)
            totalImported += imported

            // Overpass rate limit: wait 5s between regions
            if (toImport.indexOf(region) < toImport.length - 1) {
                console.log("   ⏳ Esperando 5s (rate limit Overpass)...")
                await new Promise(r => setTimeout(r, 5000))
            }
        } catch (err) {
            console.error(`   ❌ Error en ${region}:`, err)
        }
    }

    console.log(`\n🏆 TOTAL: ${totalImported} rutas importadas`)
    await prisma.$disconnect()
}

interface Route { name: string; distance: number; coords: { lat: number; lng: number }[] }

async function fetchRoutes(bbox: { south: number; west: number; north: number; east: number }, limit: number): Promise<Route[]> {
    const { south, west, north, east } = bbox
    const query = `[out:json][timeout:60];(way["highway"="path"]["name"](${south},${west},${north},${east});way["highway"="footway"]["name"](${south},${west},${north},${east});relation["route"="hiking"]["name"](${south},${west},${north},${east}););out body;>;out skel qt;`
    const res = await fetch(OVERPASS_API, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `data=${encodeURIComponent(query)}` })
    if (!res.ok) throw new Error(`Overpass ${res.status}`)
    const data = await res.json()

    const nodes = new Map<number, { lat: number; lon: number }>()
    const ways: any[] = []
    for (const el of data.elements) {
        if (el.type === "node" && el.lat) nodes.set(el.id, { lat: el.lat, lon: el.lon })
        if (el.type === "way" && el.tags?.name && el.nodes) ways.push(el)
    }

    return ways.slice(0, limit).map(w => {
        const coords = (w.nodes as number[]).map(n => nodes.get(n)).filter(Boolean).map(n => ({ lat: n!.lat, lng: n!.lon }))
        return { name: w.tags.name, distance: haversine(coords), coords }
    }).filter(r => r.coords.length >= 2)
}

function haversine(coords: { lat: number; lng: number }[]): number {
    let d = 0
    for (let i = 1; i < coords.length; i++) {
        const R = 6371000, dLat = (coords[i].lat - coords[i - 1].lat) * Math.PI / 180, dLng = (coords[i].lng - coords[i - 1].lng) * Math.PI / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(coords[i - 1].lat * Math.PI / 180) * Math.cos(coords[i].lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
        d += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    return Math.round(d)
}

function toGpx(r: Route): string {
    const pts = r.coords.map(c => `<trkpt lat="${c.lat}" lon="${c.lng}"/>`).join("\n")
    return `<?xml version="1.0"?><gpx version="1.1" creator="GuideFlow"><trk><name>${r.name.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</name><trkseg>${pts}</trkseg></trk></gpx>`
}

function toGeojson(r: Route): string {
    return JSON.stringify({ type: "Feature", properties: { name: r.name }, geometry: { type: "LineString", coordinates: r.coords.map(c => [c.lng, c.lat]) } })
}

main().catch(console.error)
