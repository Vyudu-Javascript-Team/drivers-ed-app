import { describe, expect, it, jest } from '@jest/globals';
import { DunningManager } from '@/lib/payment/dunning-manager';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { notificationManager } from '@/lib/notifications';

jest.mock('@/lib/prisma');
jest.mock('@/lib/stripe');
jest.mock('@/lib/notifications');

describe('DunningManager', () => {
  it('should create dunning record for failed payment', async () => {
    const mockSubscription = {
      id: 'sub_123',
      customer: 'cus_123',
    };

    const mockUser = {
      id: 'user_123',
      email: 'test@example.com',
    };

    (stripe.subscriptions.retrieve as jest.Mock).mockResolvedValue(mockSubscription);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (prisma.dunningRecord.create as jest.Mock).mockResolvedValue({
      id: 'dunning_123',
      userId: mockUser.id,
      status: 'STARTED',
    });

    const result = await DunningManager.handleFailedPayment('sub_123', 'inv_123');

    expect(result.status).toBe('STARTED');
    expect(notificationManager.sendNotification).toHaveBeenCalled();
  });

  // Add more test cases for retry logic, max retries, etc.
});