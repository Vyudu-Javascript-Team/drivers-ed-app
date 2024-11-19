import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface QuestionSelectionCriteria {
  state: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  weakAreas?: string[];
  count: number;
  excludeIds?: string[];
}

export class QuestionSelector {
  static async selectQuestions(criteria: QuestionSelectionCriteria) {
    try {
      const questions = [];
      
      // First, select questions from weak areas
      if (criteria.weakAreas?.length) {
        const weakAreaQuestions = await this.selectWeakAreaQuestions(
          criteria,
          Math.floor(criteria.count * 0.4) // 40% of questions from weak areas
        );
        questions.push(...weakAreaQuestions);
      }

      // Fill remaining with general questions
      const remainingCount = criteria.count - questions.length;
      if (remainingCount > 0) {
        const generalQuestions = await this.selectGeneralQuestions(
          criteria,
          remainingCount,
          questions.map(q => q.id)
        );
        questions.push(...generalQuestions);
      }

      // Ensure variety in question types
      this.ensureQuestionTypeVariety(questions);

      return questions;
    } catch (error) {
      logger.error('Failed to select questions:', error);
      throw error;
    }
  }

  private static async selectWeakAreaQuestions(
    criteria: QuestionSelectionCriteria,
    count: number
  ) {
    return prisma.question.findMany({
      where: {
        state: criteria.state,
        difficulty: criteria.difficulty,
        category: {
          in: criteria.weakAreas,
        },
        id: {
          notIn: criteria.excludeIds || [],
        },
      },
      take: count,
      orderBy: {
        effectiveness: 'desc',
      },
    });
  }

  private static async selectGeneralQuestions(
    criteria: QuestionSelectionCriteria,
    count: number,
    excludeIds: string[]
  ) {
    return prisma.question.findMany({
      where: {
        state: criteria.state,
        difficulty: criteria.difficulty,
        id: {
          notIn: [...(criteria.excludeIds || []), ...excludeIds],
        },
      },
      take: count,
      orderBy: {
        effectiveness: 'desc',
      },
    });
  }

  private static ensureQuestionTypeVariety(questions: any[]) {
    // Ensure a good mix of question types
    const typeDistribution = {
      MULTIPLE_CHOICE: 0.6, // 60%
      IMAGE_BASED: 0.2,    // 20%
      SCENARIO_BASED: 0.2, // 20%
    };

    // Implementation continues in next action...
  }
}