import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { topic, maxParticipants } = await req.json();

    const studySession = await prisma.studySession.create({
      data: {
        hostId: session.user.id,
        topic,
        maxParticipants,
        status: 'ACTIVE',
        participants: {
          create: {
            userId: session.user.id,
            role: 'HOST',
          },
        },
      },
    });

    return NextResponse.json(studySession);
  } catch (error) {
    console.error('Failed to create study session:', error);
    return NextResponse.json(
      { error: 'Failed to create study session' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const state = searchParams.get('state');

    const sessions = await prisma.studySession.findMany({
      where: {
        status: 'ACTIVE',
        ...(topic && { topic }),
        ...(state && { state }),
      },
      include: {
        host: {
          select: {
            name: true,
            image: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch study sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study sessions' },
      { status: 500 }
    );
  }
}