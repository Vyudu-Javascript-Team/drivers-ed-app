import { describe, expect, it, jest } from '@jest/globals';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { handleStripeWebhook } from '@/app/api/webhook/route';

jest.mock('stripe');

describe('Stripe Integration', () => {
  it('should handle successful payment webhook', async () => {
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 700,
          customer: 'cus_123',
        },
      },
    };

    const response = await handleStripeWebhook(mockEvent as Stripe.Event);
    expect(response.status).toBe(200);
  });

  it('should handle failed payment webhook', async () => {
    const mockEvent = {
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_123',
          customer: 'cus_123',
          last_payment_error: {
            message: 'Card declined',
          },
        },
      },
    };

    const response = await handleStripeWebhook(mockEvent as Stripe.Event);
    expect(response.status).toBe(200);
  });

  // Add more test cases for other webhook events
});