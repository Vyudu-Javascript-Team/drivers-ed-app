import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { RecommendationEngine } from '@/lib/analytics/recommendations'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const recommendations = await RecommendationEngine.generateRecommendations(
      session.user.id
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Failed to generate recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}