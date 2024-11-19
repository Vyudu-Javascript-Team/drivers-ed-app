import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export class PaymentAnalytics {
  static async getRevenueMetrics(period: 'day' | 'week' | 'month' | 'year') {
    try {
      const startDate = this.getStartDate(period);
      
      const [revenue, subscriptions] = await Promise.all([
        this.calculateRevenue(startDate),
        this.getSubscriptionMetrics(startDate),
      ]);

      return {
        revenue,
        subscriptions,
        mrr: revenue.current / (period === 'month' ? 1 : 12),
        arr: revenue.current * (period === 'month' ? 12 : 1),
      };
    } catch (error) {
      logger.error('Failed to get revenue metrics:', error);
      throw error;
    }
  }

  static async getChurnMetrics(period: 'day' | 'week' | 'month' | 'year') {
    try {
      const startDate = this.getStartDate(period);
      
      const [canceledSubscriptions, totalSubscriptions] = await Promise.all([
        prisma.user.count({
          where: {
            subscriptionStatus: 'canceled',
            subscriptionPeriodEnd: {
              gte: startDate,
            },
          },
        }),
        prisma.user.count({
          where: {
            subscriptionStatus: 'active',
            subscriptionPeriodEnd: {
              gte: startDate,
            },
          },
        }),
      ]);

      return {
        churnRate: (canceledSubscriptions / totalSubscriptions) * 100,
        canceledCount: canceledSubscriptions,
        totalSubscriptions,
      };
    } catch (error) {
      logger.error('Failed to get churn metrics:', error);
      throw error;
    }
  }

  static async getPaymentFailureAnalysis(period: 'day' | 'week' | 'month' | 'year') {
    try {
      const startDate = this.getStartDate(period);
      
      const dunningRecords = await prisma.dunningRecord.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          user: true,
        },
      });

      const analysis = {
        totalFailures: dunningRecords.length,
        recoveryRate: this.calculateRecoveryRate(dunningRecords),
        averageRecoveryTime: this.calculateAverageRecoveryTime(dunningRecords),
        failureReasons: this.aggregateFailureReasons(dunningRecords),
      };

      return analysis;
    } catch (error) {
      logger.error('Failed to get payment failure analysis:', error);
      throw error;
    }
  }

  private static async calculateRevenue(startDate: Date) {
    const charges = await stripe.charges.list({
      created: { gte: Math.floor(startDate.getTime() / 1000) },
    });

    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);

    const previousCharges = await stripe.charges.list({
      created: {
        gte: Math.floor(previousPeriodStart.getTime() / 1000),
        lt: Math.floor(startDate.getTime() / 1000),
      },
    });

    return {
      current: charges.data.reduce((sum, charge) => sum + charge.amount, 0) / 100,
      previous: previousCharges.data.reduce((sum, charge) => sum + charge.amount, 0) / 100,
    };
  }

  private static async getSubscriptionMetrics(startDate: Date) {
    const [newSubscriptions, activeSubscriptions] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
          subscriptionStatus: 'active',
        },
      }),
      prisma.user.count({
        where: {
          subscriptionStatus: 'active',
        },
      }),
    ]);

    return {
      new: newSubscriptions,
      active: activeSubscriptions,
      growthRate: (newSubscriptions / activeSubscriptions) * 100,
    };
  }

  private static getStartDate(period: 'day' | 'week' | 'month' | 'year'): Date {
    const date = new Date();
    switch (period) {
      case 'day':
        date.setDate(date.getDate() - 1);
        break;
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  }

  private static calculateRecoveryRate(dunningRecords: any[]): number {
    const recovered = dunningRecords.filter(r => r.status === 'RECOVERED').length;
    return (recovered / dunningRecords.length) * 100;
  }

  private static calculateAverageRecoveryTime(dunningRecords: any[]): number {
    const recoveredRecords = dunningRecords.filter(r => 
      r.status === 'RECOVERED' && r.completedAt
    );

    if (recoveredRecords.length === 0) return 0;

    const totalTime = recoveredRecords.reduce((sum, record) => {
      const time = record.completedAt.getTime() - record.createdAt.getTime();
      return sum + time;
    }, 0);

    return totalTime / recoveredRecords.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private static aggregateFailureReasons(dunningRecords: any[]): Record<string, number> {
    return dunningRecords.reduce((acc, record) => {
      const reason = record.failureReason || 'unknown';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});
  }
}