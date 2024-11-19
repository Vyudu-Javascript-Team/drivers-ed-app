import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const stories = await prisma.story.findMany({
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error("Failed to fetch stories:", error)
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, description, state } = await req.json()

    const story = await prisma.story.create({
      data: {
        title,
        description,
        state,
        content: [],
        published: false,
      },
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error("Failed to create story:", error)
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    )
  }
}