import { prisma } from '@/lib/prisma';
import { DifficultyAdjuster } from '@/lib/analytics/difficulty-adjuster';

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ORDERING' | 'IMAGE_BASED';
  options: any[];
  correctAnswer: any;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit?: number;
  points: number;
  explanation: string;
}

interface TestTemplate {
  title: string;
  description: string;
  state: string;
  questions: Question[];
  timeLimit: number;
  totalPoints: number;
  passingScore: number;
}

export class TestGenerator {
  static readonly DIFFICULTY_WEIGHTS = {
    EASY: { EASY: 0.7, MEDIUM: 0.3, HARD: 0 },
    MEDIUM: { EASY: 0.3, MEDIUM: 0.4, HARD: 0.3 },
    HARD: { EASY: 0.1, MEDIUM: 0.3, HARD: 0.6 },
  };

  static async generateTest(
    userId: string,
    state: string,
    category?: string
  ): Promise<TestTemplate> {
    // Get user's difficulty settings
    const settings = await prisma.userTestSettings.findUnique({
      where: {
        userId_category: {
          userId,
          category: category || 'GENERAL',
        },
      },
    });

    const difficulty = settings?.difficulty || 'MEDIUM';
    const weights = this.DIFFICULTY_WEIGHTS[difficulty as keyof typeof this.DIFFICULTY_WEIGHTS];

    // Get questions based on difficulty distribution
    const questions = await this.getQuestionsWithDistribution(
      state,
      category,
      weights
    );

    const timeLimit = this.calculateTimeLimit(questions);
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    return {
      title: `${state} Driver's License Practice Test`,
      description: `Test your knowledge of ${state} driving rules and regulations`,
      state,
      questions,
      timeLimit,
      totalPoints,
      passingScore: Math.ceil(totalPoints * 0.7), // 70% to pass
    };
  }

  private static async getQuestionsWithDistribution(
    state: string,
    category: string | undefined,
    weights: Record<string, number>
  ) {
    const questions: Question[] = [];
    const totalQuestions = 20;

    for (const [difficulty, weight] of Object.entries(weights)) {
      const count = Math.round(totalQuestions * weight);
      if (count === 0) continue;

      const difficultyQuestions = await prisma.question.findMany({
        where: {
          state,
          category,
          difficulty,
        },
        take: count,
      });

      questions.push(...difficultyQuestions);
    }

    return this.shuffleArray(questions);
  }

  private static calculateTimeLimit(questions: Question[]): number {
    // Base time plus additional time for each question based on type and difficulty
    const baseTime = 300; // 5 minutes base time
    const additionalTime = questions.reduce((sum, q) => {
      const typeTime = {
        MULTIPLE_CHOICE: 45,
        TRUE_FALSE: 30,
        ORDERING: 60,
        IMAGE_BASED: 60,
      }[q.type];

      const difficultyMultiplier = {
        EASY: 1,
        MEDIUM: 1.2,
        HARD: 1.5,
      }[q.difficulty];

      return sum + (typeTime * difficultyMultiplier);
    }, 0);

    return Math.round((baseTime + additionalTime) / 60); // Convert to minutes
  }

  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static async saveTestResult(
    userId: string,
    testId: string,
    answers: any[],
    timeSpent: number
  ) {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { questions: true, totalPoints: true },
    });

    if (!test) throw new Error('Test not found');

    const questions = test.questions as Question[];
    const points = questions.reduce((sum, q, index) => {
      return sum + (this.isCorrectAnswer(q, answers[index]) ? q.points : 0);
    }, 0);

    const score = Math.round((points / test.totalPoints) * 100);

    // Save test result
    const result = await prisma.testResult.create({
      data: {
        userId,
        testId,
        score,
        points,
        answers,
        timeSpent,
      },
    });

    // Adjust difficulty if needed
    if (score >= 85) {
      await DifficultyAdjuster.increaseDifficulty(userId, test.questions[0].category);
    } else if (score <= 60) {
      await DifficultyAdjuster.decreaseDifficulty(userId, test.questions[0].category);
    }

    return result;
  }

  private static isCorrectAnswer(question: Question, answer: any): boolean {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
        return answer === question.correctAnswer;
      case 'ORDERING':
        return JSON.stringify(answer) === JSON.stringify(question.correctAnswer);
      case 'IMAGE_BASED':
        return answer === question.correctAnswer;
      default:
        return false;
    }
  }
}