import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const achievementSchema = z.object({
  achievementId: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const achievements = await prisma.userAchievement.findMany({
      where: {
        userEmail: session.user.email,
      },
      include: {
        achievement: true,
      },
      orderBy: {
        unlockedAt: 'desc',
      },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
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
    const body = achievementSchema.parse(json);

    // Check if achievement already unlocked
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userEmail_achievementId: {
          userEmail: session.user.email,
          achievementId: body.achievementId,
        },
      },
    });

    if (existing) {
      return new NextResponse('Achievement already unlocked', { status: 400 });
    }

    // Get achievement details
    const achievement = await prisma.achievement.findUnique({
      where: {
        id: body.achievementId,
      },
    });

    if (!achievement) {
      return new NextResponse('Achievement not found', { status: 404 });
    }

    // Unlock achievement and award XP
    const [userAchievement, userProgress] = await prisma.$transaction([
      prisma.userAchievement.create({
        data: {
          userEmail: session.user.email,
          achievementId: body.achievementId,
          unlockedAt: new Date(),
        },
        include: {
          achievement: true,
        },
      }),
      prisma.userProgress.update({
        where: {
          userEmail: session.user.email,
        },
        data: {
          xp: {
            increment: achievement.xpReward,
          },
        },
      }),
    ]);

    return NextResponse.json({
      achievement: userAchievement,
      progress: userProgress,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('Error unlocking achievement:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
