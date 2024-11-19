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
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Upload to storage (implementation depends on your storage solution)
    const url = await uploadMedia(file)

    // Save media reference
    const media = await prisma.media.create({
      data: {
        storyId: params.id,
        url,
        type: file.type,
        size: file.size,
        name: file.name,
      },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error("Failed to upload media:", error)
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 }
    )
  }
}

async function uploadMedia(file: File): Promise<string> {
  // Implementation for your chosen storage solution
  // This could be AWS S3, Cloudinary, etc.
  return "https://example.com/media/file.jpg" // Placeholder
}