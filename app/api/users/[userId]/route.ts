import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  notifications: z.boolean().optional(),
  twoFactorAuth: z.boolean().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only view their own profile unless they're an admin
    if (session.user.id !== params.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        bio: true,
        image: true,
        notifications: true,
        twoFactorAuth: true,
        lastLogin: true,
        createdAt: true,
        level: true,
        xp: true,
        progress: {
          select: {
            storyId: true,
            progress: true,
            completed: true,
            updatedAt: true,
          },
        },
        testResults: {
          select: {
            testId: true,
            score: true,
            passed: true,
            completedAt: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only update their own profile unless they're an admin
    if (session.user.id !== params.userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Regular users can't change their role or status
    if (session.user.role !== 'ADMIN') {
      const body = userUpdateSchema.omit({ role: true, status: true }).parse(await request.json())
      const user = await prisma.user.update({
        where: { id: params.userId },
        data: body,
      })
      return NextResponse.json(user)
    }

    // Admins can update all fields
    const body = userUpdateSchema.parse(await request.json())
    const user = await prisma.user.update({
      where: { id: params.userId },
      data: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete users' }, { status: 403 })
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: params.userId },
      data: { deleted: true },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
