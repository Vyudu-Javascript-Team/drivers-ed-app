import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const progress = await prisma.storyProgress.findUnique({
      where: {
        userId_storyId: {
          userId: session.user.id,
          storyId: params.storyId,
        },
      },
    })

    return NextResponse.json(progress || { progress: 0 })
  } catch (error) {
    console.error('Failed to fetch progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storyId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { progress } = await req.json()

    const updatedProgress = await prisma.storyProgress.upsert({
      where: {
        userId_storyId: {
          userId: session.user.id,
          storyId: params.storyId,
        },
      },
      update: {
        progress,
        completed: progress === 100,
      },
      create: {
        userId: session.user.id,
        storyId: params.storyId,
        progress,
        completed: progress === 100,
      },
    })

    return NextResponse.json(updatedProgress)
  } catch (error) {
    console.error('Failed to update progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}