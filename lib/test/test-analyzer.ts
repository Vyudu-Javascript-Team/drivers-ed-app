import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class TestAnalyzer {
  static async analyzeTestResult(testId: string) {
    try {
      const result = await prisma.testResult.findUnique({
        where: { id: testId },
        include: {
          test: {
            include: { questions: true }
          },
          user: {
            include: { testResults: true }
          }
        }
      });

      if (!result) throw new Error('Test result not found');

      const analysis = {
        score: this.calculateScore(result),
        timeEfficiency: this.analyzeTimeEfficiency(result),
        categoryBreakdown: this.analyzeCategoryPerformance(result),
        mistakePatterns: this.analyzeMistakePatterns(result),
        improvement: this.calculateImprovement(result),
        recommendations: await this.generateRecommendations(result)
      };

      await this.saveAnalysis(testId, analysis);
      return analysis;
    } catch (error) {
      logger.error('Failed to analyze test result:', error);
      throw error;
    }
  }

  private static calculateScore(result: any) {
    const correctAnswers = result.answers.filter(
      (answer: any, index: number) => answer === result.test.questions[index].correctAnswer
    ).length;

    return {
      raw: (correctAnswers / result.test.questions.length) * 100,
      weighted: this.calculateWeightedScore(result),
      percentile: await this.calculatePercentile(result)
    };
  }

  private static calculateWeightedScore(result: any) {
    let totalPoints = 0;
    let earnedPoints = 0;

    result.test.questions.forEach((question: any, index: number) => {
      totalPoints += question.points;
      if (result.answers[index] === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });

    return (earnedPoints / totalPoints) * 100;
  }

  private static async calculatePercentile(result: any) {
    const allScores = await prisma.testResult.findMany({
      where: {
        test: { state: result.test.state },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: { score: true }
    });

    const scores = allScores.map(s => s.score).sort((a, b) => a - b);
    const index = scores.findIndex(score => score >= result.score);
    return (index / scores.length) * 100;
  }

  private static analyzeTimeEfficiency(result: any) {
    const averageTimePerQuestion = result.timeSpent / result.test.questions.length;
    const expectedTime = result.test.timeLimit * 60 / result.test.questions.length;

    return {
      averageTimePerQuestion,
      timeEfficiencyScore: Math.min(100, (expectedTime / averageTimePerQuestion) * 100),
      timeManagement: this.getTimeManagementRating(averageTimePerQuestion, expectedTime)
    };
  }

  private static getTimeManagementRating(actual: number, expected: number) {
    const ratio = actual / expected;
    if (ratio < 0.5) return 'TOO_FAST';
    if (ratio > 1.5) return 'TOO_SLOW';
    return 'OPTIMAL';
  }

  private static analyzeCategoryPerformance(result: any) {
    const categories: Record<string, { correct: number; total: number }> = {};

    result.test.questions.forEach((question: any, index: number) => {
      const category = question.category;
      if (!categories[category]) {
        categories[category] = { correct: 0, total: 0 };
      }
      categories[category].total++;
      if (result.answers[index] === question.correctAnswer) {
        categories[category].correct++;
      }
    });

    return Object.entries(categories).map(([category, stats]) => ({
      category,
      score: (stats.correct / stats.total) * 100,
      strength: this.getCategoryStrength(stats.correct / stats.total)
    }));
  }

  private static getCategoryStrength(ratio: number) {
    if (ratio >= 0.8) return 'STRONG';
    if (ratio >= 0.6) return 'MODERATE';
    return 'WEAK';
  }

  private static analyzeMistakePatterns(result: any) {
    const patterns = [];
    let consecutiveErrors = 0;
    let timeBasedErrors = 0;

    result.answers.forEach((answer: any, index: number) => {
      const question = result.test.questions[index];
      const isCorrect = answer === question.correctAnswer;

      // Track consecutive errors
      if (!isCorrect) {
        consecutiveErrors++;
        if (consecutiveErrors >= 3) {
          patterns.push({
            type: 'CONSECUTIVE_ERRORS',
            category: question.category,
            questionIndexes: [index - 2, index - 1, index]
          });
        }
      } else {
        consecutiveErrors = 0;
      }

      // Track time-based errors
      if (!isCorrect && result.questionTimes[index] < 10) { // Less than 10 seconds
        timeBasedErrors++;
        patterns.push({
          type: 'RUSHED_ANSWER',
          questionIndex: index,
          timeSpent: result.questionTimes[index]
        });
      }
    });

    return patterns;
  }

  private static calculateImprovement(result: any) {
    const previousTests = result.user.testResults
      .filter((r: any) => r.id !== result.id)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);

    if (previousTests.length === 0) return null;

    const previousScore = previousTests[0].score;
    return {
      scoreDifference: result.score - previousScore,
      trend: this.calculateTrend(previousTests.map((t: any) => t.score))
    };
  }

  private static calculateTrend(scores: number[]) {
    if (scores.length < 3) return 'INSUFFICIENT_DATA';
    
    const increases = scores.slice(1).filter((score, i) => score > scores[i]).length;
    const ratio = increases / (scores.length - 1);

    if (ratio >= 0.7) return 'IMPROVING';
    if (ratio <= 0.3) return 'DECLINING';
    return 'STABLE';
  }

  private static async generateRecommendations(result: any) {
    const weakCategories = result.categoryBreakdown
      .filter((cat: any) => cat.strength === 'WEAK')
      .map((cat: any) => cat.category);

    const recommendations = [];

    // Study recommendations
    if (weakCategories.length > 0) {
      const stories = await prisma.story.findMany({
        where: {
          state: result.test.state,
          category: { in: weakCategories }
        },
        take: 3
      });

      recommendations.push({
        type: 'STUDY_MATERIAL',
        resources: stories.map(story => ({
          type: 'STORY',
          id: story.id,
          title: story.title
        }))
      });
    }

    // Practice recommendations
    if (result.mistakePatterns.length > 0) {
      recommendations.push({
        type: 'PRACTICE',
        focus: result.mistakePatterns.map((pattern: any) => ({
          type: pattern.type,
          category: pattern.category
        }))
      });
    }

    return recommendations;
  }

  private static async saveAnalysis(testId: string, analysis: any) {
    await prisma.testAnalysis.create({
      data: {
        testId,
        analysis,
        createdAt: new Date()
      }
    });
  }
}