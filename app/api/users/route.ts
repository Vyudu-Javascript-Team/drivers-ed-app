import { NextResponse } from 'next/server'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['student', 'instructor', 'admin']),
  status: z.enum(['active', 'inactive', 'suspended']),
  phone: z.string().optional(),
  bio: z.string().optional(),
  notifications: z.boolean(),
  twoFactorAuth: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = userSchema.parse(json)

    // TODO: Add your database logic here
    // For example, using Prisma:
    // const user = await prisma.user.create({
    //   data: body,
    // })

    const user = {
      id: '123',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // TODO: Add your database logic here
    // For example:
    // const users = await prisma.user.findMany()

    const users = [
      {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
