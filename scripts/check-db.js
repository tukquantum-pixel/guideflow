const { PrismaClient } = require("@prisma/client")
async function check() {
    const p = new PrismaClient()
    try {
        const total = await p.activity.count({ where: { guide: { email: "comunidad@guideflow.com" } } })
        console.log("TOTAL_COMMUNITY_ROUTES:" + total)
        const totalAll = await p.activity.count()
        console.log("TOTAL_ALL_ACTIVITIES:" + totalAll)
        const tracks = await p.track.count()
        console.log("TOTAL_TRACKS:" + tracks)
        const users = await p.appUser.count()
        console.log("TOTAL_USERS:" + users)
        const guides = await p.guide.count()
        console.log("TOTAL_GUIDES:" + guides)
        const sample = await p.activity.findMany({
            where: { guide: { email: "comunidad@guideflow.com" } },
            select: { title: true, difficulty: true, track: { select: { distance: true } } },
            take: 8
        })
        sample.forEach(function (a) {
            var km = a.track ? (a.track.distance / 1000).toFixed(1) : "?"
            console.log("ROUTE:" + a.difficulty + "|" + a.title + "|" + km + "km")
        })
    } finally {
        await p["$disconnect"]()
    }
}
check()
