import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return new NextResponse('No signature', { status: 400 });
  }

  try {
    const result = await handleWebhook({ body, signature });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
}

// Disable body parsing, must be raw for Stripe
export const config = {
  api: {
    bodyParser: false,
  },
};
