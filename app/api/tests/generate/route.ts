import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { TestGenerator } from '@/lib/test-generator'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { state, category } = await req.json()

    const test = await TestGenerator.generateTest(state, category)
    const savedTest = await prisma.test.create({
      data: {
        ...test,
        published: true,
      },
    })

    return NextResponse.json(savedTest)
  } catch (error) {
    console.error('Failed to generate test:', error)
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    )
  }
}