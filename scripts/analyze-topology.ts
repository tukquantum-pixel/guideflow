// Analyze topology of all routes from their GeoJSON data
// Run: npx tsx scripts/analyze-topology.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface TopoFeatures {
    isCircular: boolean
    ridgeCount: number
    valleyCount: number
    hasPlateaus: boolean
    maxGradientPct: number
    avgGradientPct: number
}

function analyzeTrack(geojson: string): TopoFeatures | null {
    try {
        const data = JSON.parse(geojson)
        const coords: number[][] = data.geometry?.coordinates || []
        if (coords.length < 3) return null

        // Circular detection: start ~= end (within 200m)
        const first = coords[0], last = coords[coords.length - 1]
        const closeDist = haversine(first[1], first[0], last[1], last[0])
        const isCircular = closeDist < 200

        // Elevation analysis
        const elevations = coords.map(c => c[2] || 0).filter(e => e > 0)
        if (elevations.length < 5) return { isCircular, ridgeCount: 0, valleyCount: 0, hasPlateaus: false, maxGradientPct: 0, avgGradientPct: 0 }

        // Smooth elevations (moving average of 5)
        const smooth = elevations.map((_, i) => {
            const start = Math.max(0, i - 2), end = Math.min(elevations.length, i + 3)
            return elevations.slice(start, end).reduce((a, b) => a + b, 0) / (end - start)
        })

        // Count ridges (local maxima) and valleys (local minima)
        let ridgeCount = 0, valleyCount = 0
        for (let i = 1; i < smooth.length - 1; i++) {
            const prev = smooth[i - 1], curr = smooth[i], next = smooth[i + 1]
            if (curr > prev + 5 && curr > next + 5) ridgeCount++
            if (curr < prev - 5 && curr < next - 5) valleyCount++
        }

        // Detect plateaus (>500m horizontal with <10m elevation change)
        let hasPlateaus = false
        let flatDist = 0
        for (let i = 1; i < coords.length; i++) {
            const d = haversine(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0])
            const dz = Math.abs((coords[i][2] || 0) - (coords[i - 1][2] || 0))
            if (dz < 2 && d > 0) { flatDist += d } else { flatDist = 0 }
            if (flatDist > 500) { hasPlateaus = true; break }
        }

        // Gradient analysis
        const gradients: number[] = []
        for (let i = 1; i < coords.length; i++) {
            const d = haversine(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0])
            if (d > 5) {
                const dz = (coords[i][2] || 0) - (coords[i - 1][2] || 0)
                gradients.push(Math.abs(dz / d) * 100)
            }
        }
        const maxGradientPct = gradients.length ? Math.round(Math.max(...gradients)) : 0
        const avgGradientPct = gradients.length ? Math.round(gradients.reduce((a, b) => a + b, 0) / gradients.length) : 0

        return { isCircular, ridgeCount, valleyCount, hasPlateaus, maxGradientPct, avgGradientPct }
    } catch { return null }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function main() {
    const tracks = await prisma.track.findMany({
        where: { activity: { active: true } },
        select: { id: true, name: true, geojson: true, routeType: true },
    })
    console.log(`🔍 Analyzing ${tracks.length} tracks...`)

    let analyzed = 0, circular = 0, withRidges = 0
    for (const track of tracks) {
        if (!track.geojson) continue
        const topo = analyzeTrack(track.geojson)
        if (!topo) continue

        // Update routeType if we detected circular
        const updates: any = {}
        if (topo.isCircular && track.routeType !== "circular") updates.routeType = "circular"
        if (!topo.isCircular && !track.routeType) updates.routeType = "lineal"

        if (Object.keys(updates).length > 0) {
            await prisma.track.update({ where: { id: track.id }, data: updates })
        }

        if (topo.isCircular) circular++
        if (topo.ridgeCount > 0) withRidges++
        analyzed++

        console.log(`  ${track.name?.slice(0, 40).padEnd(42)} | ${topo.isCircular ? "🔄" : "➡️"} ${topo.ridgeCount} ridges, ${topo.valleyCount} valleys, grad ${topo.avgGradientPct}%${topo.hasPlateaus ? " 🏔️plateau" : ""}`)
    }

    console.log(`\n🏆 DONE: ${analyzed} tracks analyzed`)
    console.log(`   🔄 Circular: ${circular}`)
    console.log(`   ⛰️ With ridges: ${withRidges}`)
    await prisma.$disconnect()
}

main().catch(console.error)
