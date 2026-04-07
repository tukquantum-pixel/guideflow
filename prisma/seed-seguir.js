// Seed script: Creates a guide, activity with real GeoJSON track, and an AppUser for testing /seguir/[id]
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const p = new PrismaClient()

// Real hiking route: Circular de Moncayo (Sierra del Moncayo, Zaragoza)
const MONCAYO_GEOJSON = JSON.stringify({
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [-1.8375, 41.7855, 1200], [-1.8362, 41.7862, 1250], [-1.8348, 41.7870, 1310],
      [-1.8335, 41.7878, 1380], [-1.8322, 41.7885, 1460], [-1.8310, 41.7893, 1550],
      [-1.8298, 41.7900, 1640], [-1.8285, 41.7908, 1730], [-1.8273, 41.7915, 1820],
      [-1.8260, 41.7923, 1910], [-1.8248, 41.7930, 2000], [-1.8235, 41.7938, 2080],
      [-1.8223, 41.7945, 2140], [-1.8210, 41.7950, 2190], [-1.8200, 41.7955, 2240],
      [-1.8195, 41.7960, 2280], [-1.8192, 41.7963, 2314], // CIMA MONCAYO
      [-1.8190, 41.7960, 2280], [-1.8185, 41.7955, 2220], [-1.8178, 41.7948, 2150],
      [-1.8170, 41.7942, 2080], [-1.8165, 41.7935, 2000], [-1.8160, 41.7928, 1920],
      [-1.8158, 41.7920, 1840], [-1.8162, 41.7912, 1760], [-1.8170, 41.7905, 1680],
      [-1.8180, 41.7898, 1600], [-1.8195, 41.7892, 1520], [-1.8210, 41.7885, 1450],
      [-1.8228, 41.7880, 1390], [-1.8248, 41.7875, 1330], [-1.8268, 41.7870, 1280],
      [-1.8290, 41.7865, 1240], [-1.8315, 41.7860, 1220], [-1.8340, 41.7857, 1210],
      [-1.8365, 41.7855, 1200], [-1.8375, 41.7855, 1200], // CIERRE CIRCULAR
    ]
  },
  properties: { name: "Circular Cima del Moncayo" }
})

async function main() {
  console.log("🌱 Seeding data for /seguir testing...\n")

  // 1. Create Guide
  const hashedPw = await bcrypt.hash("TukQuantum123", 10)
  const guide = await p.guide.upsert({
    where: { email: "tukquantum@tukquantum.com" },
    update: {},
    create: {
      email: "tukquantum@tukquantum.com",
      name: "Javier Martínez",
      slug: "javier-montana",
      password: hashedPw,
      bio: "Guía profesional de montaña en el Pirineo y Sistema Ibérico. 8 años de experiencia.",
      zone: "Moncayo, Zaragoza",
      languages: ["Español", "Inglés"],
      professionType: "guia_montana",
      professionCategory: "montana",
      specializations: ["Senderismo", "Alta montaña"],
      verificationLevel: "VERIFIED",
      marketplaceEnabled: true,
    }
  })
  console.log("✅ Guide:", guide.id, guide.slug)

  // 2. Create Activity
  const existing = await p.activity.findFirst({ where: { guideId: guide.id, title: "Circular Cima del Moncayo" } })
  if (existing) {
    await p.track.deleteMany({ where: { activityId: existing.id } })
    await p.activity.delete({ where: { id: existing.id } })
  }

  const activity = await p.activity.create({
    data: {
      guideId: guide.id,
      title: "Circular Cima del Moncayo",
      description: "Ruta circular a la cima del Moncayo (2.314m), el techo del Sistema Ibérico. Salida desde el Santuario, ascenso por la cara norte y descenso por la cara sur. Vistas espectaculares del Pirineo y la Meseta.",
      priceCents: 4500,
      durationMinutes: 360,
      maxParticipants: 8,
      category: "hiking",
      difficulty: "MEDIUM",
      meetingPoint: "Santuario de la Virgen del Moncayo",
      meetingLat: 41.7855,
      meetingLng: -1.8375,
      includes: "Guía profesional titulado\nSeguro RC\nMapa topográfico\nFotos de la jornada",
      whatToBring: "Botas de montaña\nRopa de abrigo\nAgua 2L\nComida para el día\nProtección solar",
      photos: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      ],
    }
  })
  console.log("✅ Activity:", activity.id, activity.title)

  // 3. Create Track with GeoJSON
  const track = await p.track.create({
    data: {
      activityId: activity.id,
      name: "Circular Cima del Moncayo",
      gpxData: "<gpx>placeholder</gpx>",
      geojson: MONCAYO_GEOJSON,
      distance: 12800,       // 12.8 km
      elevationGain: 1114,   // 1114m D+
      elevationLoss: 1114,
      durationEst: 360,
      routeType: "circular",
      minElevation: 1200,
      maxElevation: 2314,
      seasonRecommended: ["primavera", "verano", "otoño"],
    }
  })
  console.log("✅ Track:", track.id, `(${(track.distance/1000).toFixed(1)}km, ${track.elevationGain}m D+)`)

  // 4. Create TimeSlots for next 7 days
  const today = new Date()
  for (let d = 1; d <= 7; d++) {
    const date = new Date(today)
    date.setDate(today.getDate() + d)
    date.setHours(0, 0, 0, 0)
    await p.timeSlot.create({
      data: { activityId: activity.id, date, startTime: "08:30", spotsRemaining: 6 }
    })
  }
  console.log("✅ 7 TimeSlots created")

  // 5. Create AppUser for testing
  const user = await p.appUser.upsert({
    where: { email: "test@demo.com" },
    update: {},
    create: {
      email: "test@demo.com",
      name: "Usuario Demo",
      password: hashedPw,
      plan: "FREE",
    }
  })
  console.log("✅ AppUser:", user.id, user.email)

  console.log("\n🎉 SEED COMPLETE!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("📋 Para probar /seguir:")
  console.log(`   1. npm run dev`)
  console.log(`   2. Abre http://localhost:3005/entrar`)
  console.log(`   3. Login: test@demo.com / TukQuantum123`)
  console.log(`   4. Abre http://localhost:3005/seguir/${activity.id}`)
  console.log(`   5. Click "COMENZAR SEGUIMIENTO"`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`\n🔗 Activity ID: ${activity.id}`)
}

main().catch(console.error).finally(() => p.$disconnect())
