import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import { z } from 'zod';

const checkoutSchema = z.object({
  priceId: z.string(),
  returnUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = checkoutSchema.parse(json);

    const { sessionId } = await createCheckoutSession({
      priceId: body.priceId,
      userId: session.user.id!,
      email: session.user.email,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({ sessionId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('Error creating checkout session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
