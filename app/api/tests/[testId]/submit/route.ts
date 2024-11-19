import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { testId: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { answers, timeSpent } = await req.json()

    const result = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testId: params.testId,
        answers,
        timeSpent,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to submit test:', error)
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    )
  }
}