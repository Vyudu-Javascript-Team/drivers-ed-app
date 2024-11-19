import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ContentValidator } from "@/lib/content/validator"
import { ContentOptimizer } from "@/lib/content/optimizer"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { content } = await req.json()

    // Validate content
    if (!ContentValidator.validateContent(content)) {
      return NextResponse.json(
        { error: "Invalid content format" },
        { status: 400 }
      )
    }

    // Create new version
    await prisma.storyVersion.create({
      data: {
        storyId: params.id,
        content,
        authorId: session.user.id,
      },
    })

    // Update story content
    const story = await prisma.story.update({
      where: { id: params.id },
      data: { 
        content,
        lastOptimized: new Date(),
        optimizationScore: await ContentOptimizer.calculateScore(content)
      },
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error("Failed to update content:", error)
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    )
  }
}