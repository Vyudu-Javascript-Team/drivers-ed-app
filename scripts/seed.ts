import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

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

  // Seed stories
  const states = ["GA", "FL", "NJ", "CA", "LA"]
  for (const state of states) {
    await prisma.story.createMany({
      skipDuplicates: true,
      data: [
        {
          title: `${state} Traffic Tales`,
          description: `Learn about ${state} traffic rules through engaging stories`,
          content: JSON.stringify({
            sections: [
              {
                type: "text",
                content: "Story content here...",
              },
              {
                type: "rule",
                title: "Important Rule",
                content: "Rule description here...",
              },
            ],
          }),
          state,
          published: true,
        },
      ],
    })
  }

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