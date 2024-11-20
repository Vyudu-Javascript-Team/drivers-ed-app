import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  phone: z.string().optional(),
  bio: z.string().optional(),
  notifications: z.boolean(),
  twoFactorAuth: z.boolean(),
})

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create users' },
        { status: 403 }
      )
    }

    const json = await request.json()
    const body = userSchema.parse(json)

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: body,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | null
    const status = searchParams.get('status') as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | null
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where = {
      AND: [
        { deleted: false },
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        role ? { role } : {},
        status ? { status } : {},
      ],
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where })

    // Get users with pagination and sorting
    const users = await prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        image: true,
        lastLogin: true,
        createdAt: true,
        level: true,
        xp: true,
      },
    })

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('List users error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
