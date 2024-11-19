import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class LearningPathGenerator {
  static async generatePath(userId: string, state: string) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const weakAreas = await this.identifyWeakAreas(userId, state);
      const learningStyle = await this.determineLearningStyle(userId);

      const path = {
        mainTrack: await this.generateMainTrack(state, userProfile),
        remedialTracks: await this.generateRemedialTracks(weakAreas, state),
        adaptiveChallenges: await this.generateAdaptiveChallenges(userProfile),
        milestones: this.generateMilestones(userProfile.level),
        estimatedCompletion: this.calculateEstimatedCompletion(userProfile)
      };

      await this.saveLearningPath(userId, path);
      return path;
    } catch (error) {
      logger.error('Failed to generate learning path:', error);
      throw error;
    }
  }

  private static async getUserProfile(userId: string) {
    const [user, testResults, progress] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.testResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.userProgress.findUnique({ where: { userId } })
    ]);

    return {
      level: progress?.level || 1,
      xp: progress?.xp || 0,
      averageScore: this.calculateAverageScore(testResults),
      learningRate: this.calculateLearningRate(testResults),
      completedContent: await this.getCompletedContent(userId)
    };
  }

  private static async identifyWeakAreas(userId: string, state: string) {
    const results = await prisma.testResult.findMany({
      where: { userId, test: { state } },
      include: { test: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const categoryScores: Record<string, { total: number; count: number }> = {};

    results.forEach(result => {
      result.answers.forEach((answer: any, index: number) => {
        const question = result.test.questions[index];
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

    return Object.entries(categoryScores)
      .map(([category, scores]) => ({
        category,
        score: (scores.total / scores.count) * 100,
        confidence: this.calculateConfidence(scores.count)
      }))
      .filter(area => area.score < 70 && area.confidence > 0.7);
  }

  private static async determineLearningStyle(userId: string) {
    const interactions = await prisma.userInteraction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const preferences = {
      visual: 0,
      interactive: 0,
      textual: 0,
      practical: 0
    };

    interactions.forEach(interaction => {
      switch (interaction.type) {
        case 'STORY_READ':
          preferences.textual++;
          break;
        case 'SCENARIO_COMPLETE':
          preferences.interactive++;
          preferences.practical++;
          break;
        case 'VIDEO_WATCH':
          preferences.visual++;
          break;
        case 'PRACTICE_TEST':
          preferences.practical++;
          break;
      }
    });

    return Object.entries(preferences)
      .sort(([, a], [, b]) => b - a)
      .map(([style]) => style);
  }

  private static async generateMainTrack(state: string, userProfile: any) {
    const requiredTopics = await prisma.topic.findMany({
      where: { state, required: true },
      orderBy: { order: 'asc' }
    });

    return requiredTopics.map(topic => ({
      id: topic.id,
      title: topic.title,
      estimatedDuration: topic.estimatedDuration,
      content: this.selectContentForTopic(topic, userProfile.learningStyle),
      prerequisites: topic.prerequisites,
      unlocked: this.checkPrerequisites(topic, userProfile.completedContent)
    }));
  }

  private static async generateRemedialTracks(weakAreas: any[], state: string) {
    return Promise.all(
      weakAreas.map(async area => ({
        category: area.category,
        content: await this.getRemedialContent(area.category, state),
        exercises: await this.getTargetedExercises(area.category, state),
        assessments: await this.getProgressAssessments(area.category, state)
      }))
    );
  }

  private static async generateAdaptiveChallenges(userProfile: any) {
    const challenges = [];
    const baseChallenge = {
      type: 'ADAPTIVE_TEST',
      difficulty: this.calculateChallengeDifficulty(userProfile),
      rewards: this.calculateChallengeRewards(userProfile.level)
    };

    // Weekly challenge
    challenges.push({
      ...baseChallenge,
      id: `weekly-${Date.now()}`,
      title: 'Weekly Master Challenge',
      duration: 7 * 24 * 60 * 60 * 1000, // 7 days
      requirements: { testsCompleted: 5, minAverageScore: 70 }
    });

    // Daily challenge
    challenges.push({
      ...baseChallenge,
      id: `daily-${Date.now()}`,
      title: 'Daily Quick Challenge',
      duration: 24 * 60 * 60 * 1000, // 1 day
      requirements: { testsCompleted: 1, minAverageScore: 60 }
    });

    return challenges;
  }

  private static generateMilestones(level: number) {
    const milestones = [];
    const baseXP = 1000; // XP needed for first level

    for (let i = 1; i <= 3; i++) {
      const targetLevel = level + i;
      milestones.push({
        level: targetLevel,
        xpRequired: baseXP * targetLevel,
        rewards: {
          badge: `Level ${targetLevel} Master`,
          xpBoost: Math.min(1.5, 1 + (i * 0.1)),
          features: this.getMilestoneFeatures(targetLevel)
        }
      });
    }

    return milestones;
  }

  private static calculateEstimatedCompletion(userProfile: any) {
    const averageStudyTime = 30; // minutes per day
    const totalContent = userProfile.completedContent.total;
    const remainingContent = totalContent - userProfile.completedContent.completed;
    const estimatedDaysPerContent = 2;

    const estimatedDays = Math.ceil(remainingContent * estimatedDaysPerContent);
    
    return {
      days: estimatedDays,
      date: new Date(Date.now() + estimatedDays * 24 * 60 * 60 * 1000),
      assumptions: {
        studyTimePerDay: averageStudyTime,
        contentPerDay: 1 / estimatedDaysPerContent
      }
    };
  }

  private static async saveLearningPath(userId: string, path: any) {
    await prisma.learningPath.upsert({
      where: { userId },
      update: {
        path,
        updatedAt: new Date()
      },
      create: {
        userId,
        path,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  // Helper methods...
  private static calculateAverageScore(tests: any[]) {
    if (tests.length === 0) return 0;
    return tests.reduce((sum, test) => sum + test.score, 0) / tests.length;
  }

  private static calculateLearningRate(tests: any[]) {
    if (tests.length < 2) return 1;

    const scoreChanges = tests
      .slice(1)
      .map((test, i) => test.score - tests[i].score);
    
    return Math.max(0.1, scoreChanges.reduce((a, b) => a + b, 0) / scoreChanges.length);
  }

  private static calculateConfidence(sampleSize: number) {
    const minSamples = 5;
    const maxSamples = 20;
    return Math.min(1, sampleSize / minSamples);
  }

  private static async getCompletedContent(userId: string) {
    const [stories, tests] = await Promise.all([
      prisma.storyProgress.count({
        where: { userId, completed: true }
      }),
      prisma.testResult.count({
        where: { userId }
      })
    ]);

    return {
      completed: stories + tests,
      total: await this.getTotalContentCount()
    };
  }

  private static async getTotalContentCount() {
    const [stories, tests] = await Promise.all([
      prisma.story.count(),
      prisma.test.count()
    ]);
    return stories + tests;
  }

  private static getMilestoneFeatures(level: number) {
    const features = {
      5: ['Practice Test Creation', 'Study Group Creation'],
      10: ['Custom Study Path', 'Advanced Analytics'],
      15: ['Mock Exam Mode', 'Performance Insights'],
      20: ['Study Material Creation', 'Mentor Status']
    };

    return features[level as keyof typeof features] || [];
  }
}