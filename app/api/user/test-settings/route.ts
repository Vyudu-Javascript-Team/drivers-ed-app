import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.userTestSettings.findFirst({
      where: { userId: session.user.id },
    });

    return NextResponse.json(settings || {
      difficulty: 'MEDIUM',
      adaptiveMode: true,
      category: 'GENERAL',
    });
  } catch (error) {
    console.error('Failed to fetch test settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const settings = await prisma.userTestSettings.upsert({
      where: {
        userId_category: {
          userId: session.user.id,
          category: data.category,
        },
      },
      update: {
        difficulty: data.difficulty,
        adaptiveMode: data.adaptiveMode,
      },
      create: {
        userId: session.user.id,
        category: data.category,
        difficulty: data.difficulty,
        adaptiveMode: data.adaptiveMode,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update test settings:', error);
    return NextResponse.json(
      { error: 'Failed to update test settings' },
      { status: 500 }
    );
  }
}