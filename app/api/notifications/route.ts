import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:support@driversedstories.com',
  process.env.NEXT_PUBLIC_VAPID_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subscription, title, body } = await req.json();

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        icon: '/icon.png',
        badge: '/badge.png',
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}