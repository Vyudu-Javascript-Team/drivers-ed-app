import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { notificationManager } from '@/lib/notifications';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        await prisma.user.update({
          where: { id: session.metadata?.userId },
          data: {
            subscription: {
              create: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: session.metadata?.priceId!,
                status: 'active',
                currentPeriodEnd: new Date(
                  (session.subscription as any).current_period_end * 1000
                ),
              },
            },
          },
        });

        // Award achievement
        await prisma.achievement.create({
          data: {
            userId: session.metadata?.userId!,
            type: 'SUBSCRIPTION',
            title: 'Premium Member',
            description: 'Subscribed to premium access',
            icon: '⭐️',
            rarity: 'RARE',
            xpReward: 500,
          },
        });

        await notificationManager.sendNotification(
          session.metadata?.userId!,
          'Welcome to Premium!',
          'Your subscription is now active. Enjoy full access!'
        );
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: {
            status: 'active',
            currentPeriodEnd: new Date(invoice.period_end * 1000),
          },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: { status: 'past_due' },
        });

        const user = await prisma.user.findFirst({
          where: { subscription: { stripeSubscriptionId: invoice.subscription as string } },
        });

        if (user) {
          await notificationManager.sendNotification(
            user.id,
            'Payment Failed',
            'Please update your payment method to maintain access.'
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'canceled',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}