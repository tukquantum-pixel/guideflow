import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
async function main() {
    const r = await prisma.activity.findFirst({ where: { id: "c3085e3c-4d93-4f82-b3b0-77e1af2af877" }, select: { title: true, photos: true } })
    console.log("Title:", r?.title)
    console.log("Photos:", JSON.stringify(r?.photos))
    const counts = await prisma.activity.groupBy({ by: ["active"], _count: true, having: {} })
    console.log("Route counts:", JSON.stringify(counts))
    // Check how many now have photos
    const all = await prisma.activity.findMany({ where: { active: true }, select: { photos: true } })
    const withPhotos = all.filter(a => a.photos && a.photos.length > 0).length
    console.log(`With photos: ${withPhotos}/${all.length}`)
    await prisma.$disconnect()
}
main().catch(console.error)
