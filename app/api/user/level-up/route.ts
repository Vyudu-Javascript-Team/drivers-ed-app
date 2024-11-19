import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { xp: true, level: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const nextLevelXP = user.level * 1000
    if (user.xp < nextLevelXP) {
      return NextResponse.json(
        { error: 'Not enough XP to level up' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        level: { increment: 1 },
      },
    })

    // Create level-up achievement
    await prisma.achievement.create({
      data: {
        userId: session.user.id,
        type: 'level_up',
        title: `Reached Level ${updatedUser.level}`,
        description: `Advanced to level ${updatedUser.level}`,
        xpReward: 100,
      },
    })

    return NextResponse.json({
      level: updatedUser.level,
      xpReward: 100,
    })
  } catch (error) {
    console.error('Failed to level up:', error)
    return NextResponse.json(
      { error: 'Failed to level up' },
      { status: 500 }
    )
  }
}