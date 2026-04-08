import { PrismaClient, Difficulty } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const email = 'tukquantum@tukquantum.com'
  
  // Find the guide
  let guide = await prisma.guide.findUnique({
    where: { email }
  })
  
  if (!guide) {
    console.log('No TukQuantum Guide found! Creating profile...')
    guide = await prisma.guide.create({
      data: {
        email,
        name: 'Tuk Quantum',
        slug: 'tukquantum'
      }
    })
  } else {
    console.log(`Found Guide: ${guide.name} (${guide.email})`)
  }

  const gpxPath = '/home/berraco/Escritorio/Aguas_Tuertas_Real.gpx'
  if (!fs.existsSync(gpxPath)) {
    console.log('GPX file not found!')
    return
  }
  const gpxData = fs.readFileSync(gpxPath, 'utf8')

  // Create Activity
  const activity = await prisma.activity.create({
    data: {
      guideId: guide.id,
      title: 'Aguas Tuertas - Modo Grabación GPS',
      description: 'Ruta glacial de Aguas Tuertas pre-cargada para la demostración de la WebApp de PATHY.',
      priceCents: 0,
      durationMinutes: 180,
      maxParticipants: 15,
      category: 'Trekking',
      difficulty: 'LOW',
      active: true,
      photos: ['https://s3.tours.pathy.es/aguas-tuertas.jpg']
    }
  })

  // Create Track
  await prisma.track.create({
    data: {
      activityId: activity.id,
      name: 'Aguas Tuertas - Tracker',
      gpxData: gpxData,
      distance: 4.2,
      elevationGain: 120,
      elevationLoss: 120,
      durationEst: 180,
      routeType: 'circular'
    }
  })

  console.log(`Route successfully added to Guide Profile! Activity ID: ${activity.id}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
