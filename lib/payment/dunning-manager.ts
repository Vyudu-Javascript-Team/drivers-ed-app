import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { notificationManager } from '@/lib/notifications';
import { logger } from '@/lib/logger';

export class DunningManager {
  private static readonly RETRY_SCHEDULE = [3, 5, 7]; // Days to wait between retries
  private static readonly MAX_RETRIES = 3;

  static async handleFailedPayment(subscriptionId: string, invoiceId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create dunning record
      const dunning = await prisma.dunningRecord.create({
        data: {
          userId: user.id,
          subscriptionId,
          invoiceId,
          status: 'STARTED',
          retryCount: 0,
          nextRetryDate: this.calculateNextRetryDate(0),
        },
      });

      // Send initial notification
      await this.sendDunningNotification(user.id, 'initial');

      return dunning;
    } catch (error) {
      logger.error('Failed to handle failed payment:', error);
      throw error;
    }
  }

  static async processRetry(dunningId: string) {
    try {
      const dunning = await prisma.dunningRecord.findUnique({
        where: { id: dunningId },
        include: { user: true },
      });

      if (!dunning) throw new Error('Dunning record not found');

      if (dunning.retryCount >= this.MAX_RETRIES) {
        await this.handleMaxRetriesReached(dunning);
        return;
      }

      // Attempt to retry payment
      const invoice = await stripe.invoices.pay(dunning.invoiceId);

      if (invoice.paid) {
        await this.handleSuccessfulRetry(dunning);
      } else {
        await this.scheduleNextRetry(dunning);
      }
    } catch (error) {
      logger.error('Failed to process retry:', error);
      throw error;
    }
  }

  private static async handleSuccessfulRetry(dunning: any) {
    await prisma.dunningRecord.update({
      where: { id: dunning.id },
      data: { status: 'RECOVERED', completedAt: new Date() },
    });

    await notificationManager.sendNotification(
      dunning.userId,
      'Payment Recovered',
      'Your payment has been successfully processed.'
    );
  }

  private static async handleMaxRetriesReached(dunning: any) {
    await prisma.dunningRecord.update({
      where: { id: dunning.id },
      data: { status: 'FAILED', completedAt: new Date() },
    });

    // Cancel subscription
    await stripe.subscriptions.update(dunning.subscriptionId, {
      cancel_at_period_end: true,
    });

    await notificationManager.sendNotification(
      dunning.userId,
      'Subscription Cancellation Notice',
      'Your subscription will be canceled at the end of the current period due to failed payment attempts.'
    );
  }

  private static async scheduleNextRetry(dunning: any) {
    const nextRetryDate = this.calculateNextRetryDate(dunning.retryCount + 1);

    await prisma.dunningRecord.update({
      where: { id: dunning.id },
      data: {
        retryCount: { increment: 1 },
        nextRetryDate,
        lastRetryDate: new Date(),
      },
    });

    await this.sendDunningNotification(dunning.userId, 'retry');
  }

  private static calculateNextRetryDate(retryCount: number): Date {
    const daysToAdd = this.RETRY_SCHEDULE[retryCount] || this.RETRY_SCHEDULE[0];
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  private static async sendDunningNotification(userId: string, type: 'initial' | 'retry') {
    const templates = {
      initial: {
        subject: 'Action Required: Payment Failed',
        body: 'Your payment was declined. Please update your payment method to maintain access.',
      },
      retry: {
        subject: 'Payment Retry Scheduled',
        body: 'We will attempt to process your payment again soon. Please ensure your payment method is up to date.',
      },
    };

    await notificationManager.sendNotification(
      userId,
      templates[type].subject,
      templates[type].body
    );
  }
}