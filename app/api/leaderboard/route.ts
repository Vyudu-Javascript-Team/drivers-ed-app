import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state')
  const period = searchParams.get('period') || 'weekly'
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!state) {
    return NextResponse.json({ error: 'State is required' }, { status: 400 })
  }

  try {
    const leaderboard = await prisma.leaderboard.findMany({
      where: {
        state,
        period,
      },
      take: limit,
      orderBy: {
        score: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}