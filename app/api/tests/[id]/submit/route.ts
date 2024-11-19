import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { answers, timeSpent } = await req.json()

    const test = await prisma.test.findUnique({
      where: { id: params.id },
      select: { questions: true },
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Calculate score
    const questions = test.questions as any[]
    const score = questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === answers[index] ? 1 : 0)
    }, 0)

    const finalScore = Math.round((score / questions.length) * 100)

    const result = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testId: params.id,
        score: finalScore,
        answers,
        timeSpent,
      },
    })

    return NextResponse.json({
      score: finalScore,
      result,
    })
  } catch (error) {
    console.error('Failed to submit test:', error)
    return NextResponse.json(
      { error: 'Failed to submit test' },
      { status: 500 }
    )
  }
}