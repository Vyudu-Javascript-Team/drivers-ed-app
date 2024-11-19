import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { seedStories } from "./seed/stories"
import { seedQuestions } from "./seed/questions"

const prisma = new PrismaClient()

async function main() {
  const password = await hash("password123", 12)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password,
    },
  })

  await seedStories()
  await seedQuestions()

  console.log("Database has been seeded")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })