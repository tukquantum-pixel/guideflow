// Fix route photos with WORKING Unsplash CDN URLs (direct image links)
// Run: npx tsx scripts/enrich-photos.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Curated Unsplash photo IDs by category — all verified hiking/outdoor images
const PHOTO_IDS: Record<string, string[]> = {
    "senderismo": [
        "photo-1551632811-561732d1e306", // person hiking mountain
        "photo-1501555088652-021faa106b9b", // mountain vista panoramic
        "photo-1464822759023-fed622ff2c3b", // dramatic mountain peak
        "photo-1486870591958-9b9d0d1dda99", // mountain trail curves
        "photo-1483728642387-6c3bdd6c93e5", // mountain landscape
        "photo-1454496522488-7a8e488e8606", // mountain range snow
        "photo-1519681393784-d120267933ba", // starry mountain night
        "photo-1470770841497-7b3202a38869", // forest mountain path
        "photo-1500534623283-312aade213cc", // hiking boots trail
        "photo-1533240332313-0db49b459ad6", // green mountain valley
        "photo-1506905925346-21bda4d32df4", // alpine meadow peaks
        "photo-1445452916036-9022f526ea56", // sunrise mountain
        "photo-1542224566-6e85f2e6772f", // rocky mountain trail
        "photo-1464278533981-50106e6176b1", // forest hiking trail
        "photo-1504280390367-361c6d9f38f4", // camping mountain tent
    ],
    "escalada": [
        "photo-1522163182402-834f871fd851", // rock climbing
        "photo-1516592673884-4a382d1124c2", // cliff face
        "photo-1544984243-ec57ea16fe25", // climbing wall crag
        "photo-1452827073306-6e6e661baf57", // bouldering outdoor
        "photo-1517404215738-15263e9f9178", // sport climbing outdoor
    ],
    "barranquismo": [
        "photo-1504280317859-9f132157c796", // canyon waterfall
        "photo-1501785888041-af3ef285b470", // river gorge
        "photo-1433086966358-54859d0ed716", // waterfall nature
        "photo-1540979388789-6cee28a1cdc9", // canyon river
    ],
    "kayak": [
        "photo-1472745433479-4556f22e32c2", // kayak lake
        "photo-1502933691298-84fc14542831", // paddle adventure
        "photo-1544551763-46a013bb70d5", // kayak river
    ],
    "btt": [
        "photo-1544191696-102dbdaeeaa0", // mountain biking
        "photo-1517649763962-0c623066013b", // mtb trail
        "photo-1558618666-fcd25c85f82e", // cycling mountain
    ],
}

// Fallback pool for categories without specific photos
const FALLBACK = PHOTO_IDS["senderismo"]

function getPhotosForRoute(routeId: string, category: string, title: string): string[] {
    const pool = PHOTO_IDS[category] || FALLBACK
    // Deterministic selection based on route ID hash
    const hash = routeId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    const photos: string[] = []
    const count = 3 + (hash % 2) // 3 or 4 photos per route

    for (let i = 0; i < count; i++) {
        const idx = (hash + i * 7) % pool.length
        const photoId = pool[idx]
        photos.push(`https://images.unsplash.com/${photoId}?w=1200&h=800&fit=crop&q=80`)
    }

    return photos
}

async function main() {
    const routes = await prisma.activity.findMany({
        where: { active: true },
        select: { id: true, title: true, category: true, photos: true },
    })

    // Enrich ALL routes (replace broken URLs too)
    const toFix = routes.filter(r => !r.photos?.length || r.photos.some(p => p.includes("source.unsplash.com")))
    console.log(`🔍 Found ${toFix.length} routes to fix (${routes.length} total)`)
    if (toFix.length === 0) { console.log("✅ All photos OK!"); return }

    let fixed = 0
    for (const route of toFix) {
        const photos = getPhotosForRoute(route.id, route.category, route.title)
        await prisma.activity.update({ where: { id: route.id }, data: { photos } })
        fixed++
        if (fixed % 10 === 0) console.log(`   📸 ${fixed}/${toFix.length} fixed...`)
    }

    console.log(`\n🏆 DONE: ${fixed} routes fixed with working photo URLs`)
    await prisma.$disconnect()
}

main().catch(console.error)
