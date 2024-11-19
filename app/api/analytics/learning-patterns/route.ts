import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { LearningPatternAnalyzer } from '@/lib/analytics/learning-patterns'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const patterns = await LearningPatternAnalyzer.analyzeUserPatterns(
      session.user.id
    )

    return NextResponse.json(patterns)
  } catch (error) {
    console.error('Failed to analyze learning patterns:', error)
    return NextResponse.json(
      { error: 'Failed to analyze learning patterns' },
      { status: 500 }
    )
  }
}