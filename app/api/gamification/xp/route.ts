import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { GamificationSystem } from '@/lib/gamification'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, reason } = await req.json()

    const updatedUser = await GamificationSystem.awardXP(
      session.user.id,
      amount,
      reason
    )

    await GamificationSystem.checkAndAwardAchievements(session.user.id)

    return NextResponse.json({
      success: true,
      newXP: updatedUser.xp,
      newLevel: updatedUser.level,
    })
  } catch (error) {
    console.error('Failed to award XP:', error)
    return NextResponse.json(
      { error: 'Failed to award XP' },
      { status: 500 }
    )
  }
}