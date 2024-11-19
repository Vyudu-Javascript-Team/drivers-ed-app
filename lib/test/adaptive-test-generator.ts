import { prisma } from '@/lib/prisma';
import { DifficultyAdjuster } from './difficulty-adjuster';
import { QuestionSelector } from './question-selector';
import { logger } from '@/lib/logger';

export class AdaptiveTestGenerator {
  static async generateTest(userId: string, state: string) {
    try {
      // Get user's current difficulty level and performance history
      const userSettings = await this.getUserSettings(userId);
      const performanceHistory = await this.getPerformanceHistory(userId);

      // Calculate appropriate difficulty
      const difficulty = await DifficultyAdjuster.calculateDifficulty(
        performanceHistory
      );

      // Select questions based on difficulty and weak areas
      const questions = await QuestionSelector.selectQuestions({
        state,
        difficulty,
        weakAreas: performanceHistory.weakAreas,
        count: 25, // Standard test length
      });

      // Calculate time limit based on question types and difficulty
      const timeLimit = this.calculateTimeLimit(questions);

      // Create test session
      const test = await prisma.test.create({
        data: {
          userId,
          state,
          questions,
          difficulty,
          timeLimit,
          adaptiveSettings: {
            initialDifficulty: difficulty,
            adjustmentThreshold: 0.2,
            maxDifficultyJump: 1,
          },
          status: 'ACTIVE',
          startTime: new Date(),
        },
      });

      return test;
    } catch (error) {
      logger.error('Failed to generate adaptive test:', error);
      throw error;
    }
  }

  private static async getUserSettings(userId: string) {
    return prisma.userTestSettings.findUnique({
      where: { userId },
    });
  }

  private static async getPerformanceHistory(userId: string) {
    const recentTests = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        test: {
          select: {
            difficulty: true,
            questions: true,
          },
        },
      },
    });

    const weakAreas = this.analyzeWeakAreas(recentTests);
    const averageScore = this.calculateAverageScore(recentTests);
    const consistencyScore = this.calculateConsistencyScore(recentTests);

    return {
      weakAreas,
      averageScore,
      consistencyScore,
      recentTests,
    };
  }

  private static calculateTimeLimit(questions: any[]) {
    // Base time per question type
    const timePerType = {
      MULTIPLE_CHOICE: 60, // seconds
      IMAGE_BASED: 90,
      SCENARIO_BASED: 120,
      ORDERING: 90,
    };

    // Calculate total time needed
    const totalSeconds = questions.reduce((total, q) => {
      return total + (timePerType[q.type as keyof typeof timePerType] || 60);
    }, 0);

    // Add 10% buffer time
    return Math.ceil((totalSeconds * 1.1) / 60); // Convert to minutes
  }

  private static analyzeWeakAreas(tests: any[]) {
    const categoryScores: Record<string, { total: number; count: number }> = {};

    tests.forEach(test => {
      test.answers.forEach((answer: any, index: number) => {
        const question = test.test.questions[index];
        const category = question.category;

        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 };
        }

        categoryScores[category].count++;
        if (answer === question.correctAnswer) {
          categoryScores[category].total++;
        }
      });
    });

    // Identify categories with < 70% success rate
    return Object.entries(categoryScores)
      .filter(([_, scores]) => (scores.total / scores.count) < 0.7)
      .map(([category]) => category);
  }

  private static calculateAverageScore(tests: any[]) {
    if (tests.length === 0) return 0;
    return tests.reduce((sum, test) => sum + test.score, 0) / tests.length;
  }

  private static calculateConsistencyScore(tests: any[]) {
    if (tests.length < 2) return 1;

    const scores = tests.map(t => t.score);
    const mean = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to a 0-1 scale where lower deviation means higher consistency
    return Math.max(0, 1 - (standardDeviation / 100));
  }
}