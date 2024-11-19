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
    const { searchParams } = new URL(req.url)
    const state = searchParams.get('state')

    const results = await prisma.testResult.findMany({
      where: {
        userId: session.user.id,
        test: {
          state: state || undefined,
        },
      },
      include: {
        test: {
          select: {
            title: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate analytics
    const analytics = {
      totalTests: results.length,
      averageScore: results.reduce((acc, r) => acc + r.score, 0) / results.length,
      bestScore: Math.max(...results.map((r) => r.score)),
      recentScores: results.slice(0, 5),
      scoreDistribution: {
        '0-20': results.filter((r) => r.score <= 20).length,
        '21-40': results.filter((r) => r.score > 20 && r.score <= 40).length,
        '41-60': results.filter((r) => r.score > 40 && r.score <= 60).length,
        '61-80': results.filter((r) => r.score > 60 && r.score <= 80).length,
        '81-100': results.filter((r) => r.score > 80).length,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}