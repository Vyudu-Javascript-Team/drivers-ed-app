import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const batchActionSchema = z.object({
  action: z.enum(['delete', 'updateStatus', 'updateRole']),
  userIds: z.array(z.string()),
  value: z.string().optional(), // For status or role updates
})

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can perform batch operations' },
        { status: 403 }
      )
    }

    const json = await request.json()
    const { action, userIds, value } = batchActionSchema.parse(json)

    switch (action) {
      case 'delete':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { deleted: true },
        })
        break

      case 'updateStatus':
        if (!value || !['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid status value' },
            { status: 400 }
          )
        }
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { status: value },
        })
        break

      case 'updateRole':
        if (!value || !['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid role value' },
            { status: 400 }
          )
        }
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { role: value },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Successfully performed ${action} on ${userIds.length} users`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Batch operation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Endpoint for importing users from CSV
export async function PUT(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can import users' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const text = await file.text()
    const rows = text.split('\n').map(row => row.split(','))
    const headers = rows[0]

    const users = []
    const errors = []

    // Process each row (skipping header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      try {
        const userData = {
          name: row[headers.indexOf('name')]?.trim(),
          email: row[headers.indexOf('email')]?.trim(),
          role: row[headers.indexOf('role')]?.trim() || 'STUDENT',
          status: row[headers.indexOf('status')]?.trim() || 'ACTIVE',
          phone: row[headers.indexOf('phone')]?.trim(),
          bio: row[headers.indexOf('bio')]?.trim(),
        }

        // Validate required fields
        if (!userData.name || !userData.email) {
          throw new Error('Missing required fields')
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email },
        })

        if (existingUser) {
          errors.push(`Row ${i + 1}: User with email ${userData.email} already exists`)
          continue
        }

        // Create user
        const user = await prisma.user.create({
          data: userData,
        })

        users.push(user)
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      message: `Successfully imported ${users.length} users`,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Import users error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
