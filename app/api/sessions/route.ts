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
    const { startTime, endTime, duration } = await req.json();

    const userSession = await prisma.userSession.create({
      data: {
        userId: session.user.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
      },
    });

    return NextResponse.json(userSession);
  } catch (error) {
    console.error('Failed to save session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}