import { prisma } from '@/lib/prisma';
import { Level, XPEvent } from './types';
import { logger } from '@/lib/logger';

export class XPSystem {
  static readonly BASE_XP = 1000; // XP needed for first level

  static async awardXP(userId: string, amount: number, reason: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true },
      });

      if (!user) throw new Error('User not found');

      const newXP = user.xp + amount;
      const currentLevel = this.calculateLevel(user.xp);
      const newLevel = this.calculateLevel(newXP);

      // Update user XP and level
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel.current,
          xpHistory: {
            create: {
              amount,
              reason,
            },
          },
        },
      });

      // Log XP gain
      logger.info('XP awarded', {
        userId,
        amount,
        reason,
        newTotal: newXP,
        levelUp: newLevel.current > currentLevel.current,
      });

      return updatedUser;
    } catch (error) {
      logger.error('Failed to award XP:', error);
      throw error;
    }
  }

  static calculateLevel(xp: number): Level {
    const level = Math.floor(xp / this.BASE_XP) + 1;
    const currentLevelXP = (level - 1) * this.BASE_XP;
    const nextLevelXP = level * this.BASE_XP;
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return {
      current: level,
      xp,
      nextLevelXp: nextLevelXP,
      progress,
    };
  }

  static async getXPHistory(userId: string): Promise<XPEvent[]> {
    try {
      const history = await prisma.xpHistory.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      });

      return history.map(event => ({
        amount: event.amount,
        reason: event.reason,
        timestamp: event.timestamp,
      }));
    } catch (error) {
      logger.error('Failed to fetch XP history:', error);
      throw error;
    }
  }
}