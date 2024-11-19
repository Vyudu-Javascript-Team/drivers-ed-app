import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  MONTHLY: {
    name: 'Monthly',
    id: process.env.STRIPE_MONTHLY_PLAN_ID,
    price: 7,
    features: [
      'Access to all state content',
      'Unlimited practice tests',
      'Progress tracking',
      'Achievement system',
      'Priority support'
    ]
  },
  YEARLY: {
    name: 'Yearly',
    id: process.env.STRIPE_YEARLY_PLAN_ID,
    price: 70,
    features: [
      'All Monthly features',
      '2 months free',
      'Downloadable study materials',
      'Advanced analytics',
      'Group study features'
    ]
  }
} as const;

export async function createCheckoutSession({
  priceId,
  userId,
  email,
  returnUrl
}: {
  priceId: string;
  userId: string;
  email: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      metadata: {
        userId,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${returnUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/payment/cancelled`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to create customer portal session');
  }
}

export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw new Error('Failed to retrieve subscription');
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

export async function handleWebhook({
  body,
  signature,
}: {
  body: string;
  signature: string;
}) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription changes in your database
        await handleSubscriptionChange(subscription);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment
        await handleFailedPayment(failedPayment);
        break;
    }

    return { received: true };
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw new Error('Failed to handle webhook');
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const status = subscription.status;

  // Update user's subscription status in your database
  await fetch('/api/user/subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, status, subscriptionId: subscription.id }),
  });
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId;

  // Update user's payment status in your database
  await fetch('/api/user/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId, 
      status: 'succeeded',
      amount: paymentIntent.amount,
      paymentIntentId: paymentIntent.id 
    }),
  });
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata.userId;

  // Update user's payment status in your database
  await fetch('/api/user/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId, 
      status: 'failed',
      error: paymentIntent.last_payment_error?.message,
      paymentIntentId: paymentIntent.id 
    }),
  });
}