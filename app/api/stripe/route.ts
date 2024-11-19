import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const origin = headers().get('origin')

    // Create or retrieve customer
    let customer
    const existingCustomer = await prisma.user.findUnique({
      where: { id: body.userId },
      select: { stripeCustomerId: true },
    })

    if (existingCustomer?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(existingCustomer.stripeCustomerId)
    } else {
      const user = await prisma.user.findUnique({
        where: { id: body.userId },
      })
      customer = await stripe.customers.create({
        email: user?.email!,
        metadata: {
          userId: body.userId,
        },
      })
      await prisma.user.update({
        where: { id: body.userId },
        data: { stripeCustomerId: customer.id },
      })
    }

    // Create checkout session with multiple payment methods
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card', 'us_bank_account', 'cashapp', 'affirm'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        userId: body.userId,
      },
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session',
        },
        us_bank_account: {
          verification_method: 'instant',
          setup_future_usage: 'off_session',
        },
      },
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: body.userId,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}