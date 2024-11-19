import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const progressSchema = z.object({
  xp: z.number().min(0),
  level: z.number().min(1),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const progress = await prisma.userProgress.findUnique({
      where: {
        userEmail: session.user.email,
      },
      include: {
        achievements: true,
      },
    });

    if (!progress) {
      return new NextResponse('Progress not found', { status: 404 });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = progressSchema.parse(json);

    const progress = await prisma.userProgress.upsert({
      where: {
        userEmail: session.user.email,
      },
      update: {
        xp: body.xp,
        level: body.level,
        updatedAt: new Date(),
      },
      create: {
        userEmail: session.user.email,
        xp: body.xp,
        level: body.level,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('Error updating progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}