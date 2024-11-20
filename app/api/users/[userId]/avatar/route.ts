import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToS3 } from '@/lib/s3'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check authorization (only allow users to update their own avatar or admins)
    if (session.user.id !== params.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to S3
    const key = `avatars/${params.userId}/${Date.now()}-${file.name}`
    const avatarUrl = await uploadToS3(buffer, key, file.type)

    // Update user in database
    const user = await prisma.user.update({
      where: { id: params.userId },
      data: { image: avatarUrl },
    })

    return NextResponse.json({ avatarUrl: user.image })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
