import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state');

  if (!state) {
    return NextResponse.json({ error: 'State is required' }, { status: 400 });
  }

  try {
    const stories = await prisma.story.findMany({
      where: {
        state: state.toUpperCase(),
        published: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        progress: {
          where: {
            userId: session.user.id,
          },
          select: {
            progress: true,
          },
        },
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}