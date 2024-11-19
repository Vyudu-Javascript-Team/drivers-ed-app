import webpush from 'web-push';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class PushManager {
  static async initialize() {
    webpush.setVapidDetails(
      'mailto:support@driversedstories.com',
      process.env.NEXT_PUBLIC_VAPID_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
  }

  static async subscribeUser(userId: string, subscription: PushSubscription) {
    try {
      await prisma.pushSubscription.create({
        data: {
          userId,
          endpoint: subscription.endpoint,
          auth: subscription.keys?.auth || '',
          p256dh: subscription.keys?.p256dh || '',
        },
      });
    } catch (error) {
      logger.error('Failed to subscribe user:', error);
      throw error;
    }
  }

  static async sendNotification(userId: string, notification: {
    title: string;
    body: string;
    icon?: string;
    data?: any;
  }) {
    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      const promises = subscriptions.map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              auth: sub.auth,
              p256dh: sub.p256dh,
            },
          },
          JSON.stringify(notification)
        ).catch(error => {
          if (error.statusCode === 410) {
            return this.removeSubscription(sub.id);
          }
          throw error;
        })
      );

      await Promise.all(promises);
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  }

  // Additional methods...
}