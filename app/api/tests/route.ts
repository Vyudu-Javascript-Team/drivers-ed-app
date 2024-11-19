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

    const tests = await prisma.test.findMany({
      where: {
        state: state?.toUpperCase(),
        published: true,
      },
      include: {
        questions: true,
      },
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Failed to fetch tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}