import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'tukquantum@tukquantum.com'
  
  const guide = await prisma.guide.update({
    where: { email },
    data: {
      plan: 'PEAK' // Assuming PEAK is the premium plan based on previous schema knowledge
    }
  })
  
  console.log(`Guide ${guide.name} upgraded to plan: ${guide.plan}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
