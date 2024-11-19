import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        xp: true,
        level: true,
        progress: {
          include: {
            story: true,
          },
        },
        testResults: {
          include: {
            test: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        achievements: {
          orderBy: {
            unlockedAt: 'desc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate next level XP requirement
    const nextLevelXP = user.level * 1000

    return NextResponse.json({
      ...user,
      nextLevelXP,
    })
  } catch (error) {
    console.error('Failed to fetch user progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    )
  }
}