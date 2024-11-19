import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCustomerPortal } from '@/lib/stripe';
import { z } from 'zod';

const portalSchema = z.object({
  returnUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = portalSchema.parse(json);

    const { url } = await createCustomerPortal({
      userId: session.user.id!,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('Error creating customer portal:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
