import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class DifficultyAdjuster {
  static readonly DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD'] as const;
  
  static readonly THRESHOLDS = {
    INCREASE: {
      EASY_TO_MEDIUM: 85,
      MEDIUM_TO_HARD: 90
    },
    DECREASE: {
      HARD_TO_MEDIUM: 60,
      MEDIUM_TO_EASY: 50
    },
    CONSISTENCY: 3 // Number of tests needed at current level
  };

  static async adjustDifficulty(userId: string, testResult: any) {
    try {
      const currentSettings = await this.getCurrentSettings(userId);
      const performanceHistory = await this.getPerformanceHistory(userId);
      const newDifficulty = this.calculateNewDifficulty(
        testResult,
        currentSettings,
        performanceHistory
      );

      if (newDifficulty !== currentSettings.difficulty) {
        await this.updateDifficulty(userId, newDifficulty);
        return {
          previousDifficulty: currentSettings.difficulty,
          newDifficulty,
          reason: this.getAdjustmentReason(
            testResult,
            currentSettings.difficulty,
            newDifficulty
          )
        };
      }

      return null;
    } catch (error) {
      logger.error('Failed to adjust difficulty:', error);
      throw error;
    }
  }

  private static async getCurrentSettings(userId: string) {
    return prisma.userTestSettings.findUnique({
      where: { userId }
    }) || {
      difficulty: 'MEDIUM',
      adaptiveMode: true
    };
  }

  private static async getPerformanceHistory(userId: string) {
    const recentTests = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: this.THRESHOLDS.CONSISTENCY,
      include: {
        test: {
          select: { difficulty: true }
        }
      }
    });

    return {
      averageScore: this.calculateAverageScore(recentTests),
      consistency: this.calculateConsistency(recentTests),
      trend: this.calculateTrend(recentTests)
    };
  }

  private static calculateNewDifficulty(
    testResult: any,
    currentSettings: any,
    history: any
  ) {
    const { difficulty } = currentSettings;
    const { score } = testResult;
    const { consistency, trend } = history;

    // Only adjust if performance is consistent
    if (consistency < 0.7) return difficulty;

    // Check for increase
    if (
      (difficulty === 'EASY' && score >= this.THRESHOLDS.INCREASE.EASY_TO_MEDIUM) ||
      (difficulty === 'MEDIUM' && score >= this.THRESHOLDS.INCREASE.MEDIUM_TO_HARD)
    ) {
      return this.getNextDifficulty(difficulty, 'up');
    }

    // Check for decrease
    if (
      (difficulty === 'HARD' && score <= this.THRESHOLDS.DECREASE.HARD_TO_MEDIUM) ||
      (difficulty === 'MEDIUM' && score <= this.THRESHOLDS.DECREASE.MEDIUM_TO_EASY)
    ) {
      return this.getNextDifficulty(difficulty, 'down');
    }

    return difficulty;
  }

  private static getNextDifficulty(
    current: typeof this.DIFFICULTY_LEVELS[number],
    direction: 'up' | 'down'
  ) {
    const levels = this.DIFFICULTY_LEVELS;
    const currentIndex = levels.indexOf(current);
    const nextIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    return levels[nextIndex] || current;
  }

  private static calculateAverageScore(tests: any[]) {
    if (tests.length === 0) return 0;
    return tests.reduce((sum, test) => sum + test.score, 0) / tests.length;
  }

  private static calculateConsistency(tests: any[]) {
    if (tests.length < 2) return 1;

    const scores = tests.map(t => t.score);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    return Math.max(0, 1 - (standardDeviation / 100));
  }

  private static calculateTrend(tests: any[]) {
    if (tests.length < 3) return 'STABLE';

    const scores = tests.map(t => t.score);
    const increases = scores.slice(1).filter((score, i) => score > scores[i]).length;
    const ratio = increases / (scores.length - 1);

    if (ratio >= 0.7) return 'IMPROVING';
    if (ratio <= 0.3) return 'DECLINING';
    return 'STABLE';
  }

  private static async updateDifficulty(userId: string, difficulty: string) {
    await prisma.userTestSettings.upsert({
      where: { userId },
      update: { difficulty },
      create: {
        userId,
        difficulty,
        adaptiveMode: true
      }
    });

    // Log difficulty change
    await prisma.difficultyChangeLog.create({
      data: {
        userId,
        newDifficulty: difficulty,
        reason: this.getAdjustmentReason(null, '', difficulty),
        timestamp: new Date()
      }
    });
  }

  private static getAdjustmentReason(
    testResult: any,
    oldDifficulty: string,
    newDifficulty: string
  ) {
    if (!testResult) return 'MANUAL_ADJUSTMENT';

    if (newDifficulty > oldDifficulty) {
      return `Consistent high performance (${testResult.score}%) at ${oldDifficulty} level`;
    }

    return `Performance below threshold (${testResult.score}%) at ${oldDifficulty} level`;
  }
}