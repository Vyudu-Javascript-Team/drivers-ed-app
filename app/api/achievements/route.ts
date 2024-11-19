import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { type, title, description, xpReward } = await req.json();

    const achievement = await prisma.achievement.create({
      data: {
        userId: session.user.id,
        type,
        title,
        description,
        xpReward,
      },
    });

    // Award XP for the achievement
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        xp: { increment: xpReward },
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Failed to create achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}