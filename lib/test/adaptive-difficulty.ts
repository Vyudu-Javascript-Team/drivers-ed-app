import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class AdaptiveDifficulty {
  static readonly DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'] as const;
  
  static readonly PERFORMANCE_THRESHOLDS = {
    INCREASE: 85, // Score needed to increase difficulty
    DECREASE: 60, // Score that triggers difficulty decrease
    CONSISTENCY: 3  // Number of tests needed at current level
  };

  static async adjustDifficulty(userId: string, testResult: any) {
    try {
      const recentResults = await this.getRecentResults(userId);
      const currentLevel = this.getCurrentLevel(recentResults);
      const newLevel = this.calculateNewLevel(testResult.score, currentLevel, recentResults);

      if (newLevel !== currentLevel) {
        await this.updateDifficulty(userId, newLevel);
        return newLevel;
      }

      return currentLevel;
    } catch (error) {
      logger.error('Failed to adjust difficulty:', error);
      throw error;
    }
  }

  static async getPersonalizedQuestions(userId: string, category: string) {
    const userLevel = await this.getUserLevel(userId);
    const weakAreas = await this.identifyWeakAreas(userId);
    
    return this.selectQuestions(userLevel, category, weakAreas);
  }

  private static async getUserLevel(userId: string) {
    const settings = await prisma.userTestSettings.findFirst({
      where: { userId }
    });
    return settings?.difficulty || 'MEDIUM';
  }

  private static async identifyWeakAreas(userId: string) {
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { test: true }
    });

    const categoryScores: Record<string, { total: number; count: number }> = {};

    results.forEach(result => {
      const category = result.test.category;
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 };
      }
      categoryScores[category].total += result.score;
      categoryScores[category].count++;
    });

    return Object.entries(categoryScores)
      .map(([category, scores]) => ({
        category,
        averageScore: scores.total / scores.count
      }))
      .filter(cat => cat.averageScore < 70) // Categories with < 70% average
      .map(cat => cat.category);
  }

  private static async selectQuestions(level: string, category: string, weakAreas: string[]) {
    // Implementation details...
  }

  // Additional helper methods...
}