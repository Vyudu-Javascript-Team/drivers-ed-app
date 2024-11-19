import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class FeedbackGenerator {
  static async generateFeedback(testResult: any) {
    try {
      const feedback = {
        overall: this.generateOverallFeedback(testResult),
        byCategory: await this.generateCategoryFeedback(testResult),
        improvements: this.generateImprovementSuggestions(testResult),
        nextSteps: await this.generateNextSteps(testResult),
      };

      await this.saveFeedback(testResult.id, feedback);
      return feedback;
    } catch (error) {
      logger.error('Failed to generate feedback:', error);
      throw error;
    }
  }

  private static generateOverallFeedback(testResult: any) {
    const { score, timeSpent, questions } = testResult;
    
    return {
      performance: this.getPerformanceLevel(score),
      timeManagement: this.analyzeTimeManagement(timeSpent, questions.length),
      accuracy: this.calculateAccuracy(testResult),
      consistencyScore: this.calculateConsistency(testResult),
    };
  }

  private static async generateCategoryFeedback(testResult: any) {
    const categoryScores = this.calculateCategoryScores(testResult);
    
    return Object.entries(categoryScores).map(([category, score]) => ({
      category,
      score,
      status: this.getCategoryStatus(score),
      recommendedResources: this.getResourcesForCategory(category),
    }));
  }

  private static generateImprovementSuggestions(testResult: any) {
    const suggestions = [];
    
    // Analyze incorrect answers
    const incorrectAnswers = testResult.answers.filter(
      (answer: any, index: number) => answer !== testResult.questions[index].correctAnswer
    );

    // Group by mistake patterns
    const patterns = this.analyzeMistakePatterns(incorrectAnswers);
    
    // Generate specific suggestions based on patterns
    return patterns.map(pattern => ({
      area: pattern.area,
      suggestion: this.getSuggestionForPattern(pattern),
      resources: this.getResourcesForPattern(pattern),
    }));
  }

  private static async generateNextSteps(testResult: any) {
    const { score, userId } = testResult;

    // Get user's learning history
    const history = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const recommendations = [];

    // Check if score improved
    const previousScore = history[1]?.score || 0;
    if (score > previousScore) {
      recommendations.push({
        type: 'ENCOURAGEMENT',
        message: 'Great improvement! Keep up the good work!',
      });
    }

    // Recommend next difficulty level
    if (score >= 90) {
      recommendations.push({
        type: 'DIFFICULTY',
        message: 'You\'re ready for more challenging questions!',
        action: 'INCREASE_DIFFICULTY',
      });
    } else if (score < 60) {
      recommendations.push({
        type: 'DIFFICULTY',
        message: 'Let\'s practice with some easier questions to build confidence.',
        action: 'DECREASE_DIFFICULTY',
      });
    }

    // Suggest specific study areas
    const weakCategories = this.getWeakCategories(testResult);
    if (weakCategories.length > 0) {
      recommendations.push({
        type: 'STUDY',
        message: 'Focus on these topics:',
        topics: weakCategories,
      });
    }

    return recommendations;
  }

  private static getPerformanceLevel(score: number) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'SATISFACTORY';
    return 'NEEDS_IMPROVEMENT';
  }

  private static analyzeTimeManagement(timeSpent: number, questionCount: number) {
    const averageTimePerQuestion = timeSpent / questionCount;
    const idealTimePerQuestion = 60; // seconds

    if (averageTimePerQuestion > idealTimePerQuestion * 1.5) {
      return {
        status: 'TOO_SLOW',
        suggestion: 'Try to answer questions more quickly while maintaining accuracy.',
      };
    }

    if (averageTimePerQuestion < idealTimePerQuestion * 0.5) {
      return {
        status: 'TOO_FAST',
        suggestion: 'Take more time to carefully read each question.',
      };
    }

    return {
      status: 'GOOD',
      suggestion: 'Your pace is good!',
    };
  }

  private static calculateAccuracy(testResult: any) {
    const { answers, questions } = testResult;
    const correct = answers.filter(
      (answer: any, index: number) => answer === questions[index].correctAnswer
    ).length;

    return (correct / questions.length) * 100;
  }

  private static calculateConsistency(testResult: any) {
    const { answers, questions } = testResult;
    let streaks = { correct: 0, incorrect: 0 };
    let currentStreak = { type: null, count: 0 };

    answers.forEach((answer: any, index: number) => {
      const isCorrect = answer === questions[index].correctAnswer;
      
      if (currentStreak.type === null) {
        currentStreak.type = isCorrect;
        currentStreak.count = 1;
      } else if (currentStreak.type === isCorrect) {
        currentStreak.count++;
      } else {
        if (currentStreak.type) {
          streaks.correct = Math.max(streaks.correct, currentStreak.count);
        } else {
          streaks.incorrect = Math.max(streaks.incorrect, currentStreak.count);
        }
        currentStreak = { type: isCorrect, count: 1 };
      }
    });

    return {
      maxCorrectStreak: streaks.correct,
      maxIncorrectStreak: streaks.incorrect,
      consistency: streaks.correct / (streaks.correct + streaks.incorrect),
    };
  }

  private static async saveFeedback(testResultId: string, feedback: any) {
    await prisma.testFeedback.create({
      data: {
        testResultId,
        feedback,
      },
    });
  }
}