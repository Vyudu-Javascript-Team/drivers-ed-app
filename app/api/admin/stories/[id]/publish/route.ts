import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email === process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const story = await prisma.story.update({
      where: { id: params.id },
      data: { published: true },
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error("Failed to publish story:", error)
    return NextResponse.json(
      { error: "Failed to publish story" },
      { status: 500 }
    )
  }
}