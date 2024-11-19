import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export class ContentOptimizer {
  static async optimizeContent(stateCode: string) {
    try {
      const content = await prisma.story.findMany({
        where: { state: stateCode },
        include: {
          questions: true,
          progress: true
        }
      });

      const optimizations = await this.analyzeContent(content);
      await this.applyOptimizations(stateCode, optimizations);

      return optimizations;
    } catch (error) {
      logger.error('Failed to optimize content:', error);
      throw error;
    }
  }

  private static async analyzeContent(content: any[]) {
    const optimizations = {
      stories: [] as any[],
      questions: [] as any[],
      recommendations: [] as string[]
    };

    // Analyze story engagement
    content.forEach(story => {
      const engagement = this.calculateEngagement(story);
      if (engagement < 0.7) { // 70% engagement threshold
        optimizations.stories.push({
          id: story.id,
          title: story.title,
          engagement,
          recommendations: this.generateStoryRecommendations(story)
        });
      }
    });

    // Analyze question effectiveness
    const questions = content.flatMap(story => story.questions);
    questions.forEach(question => {
      const effectiveness = this.calculateQuestionEffectiveness(question);
      if (effectiveness < 0.6) { // 60% effectiveness threshold
        optimizations.questions.push({
          id: question.id,
          effectiveness,
          recommendations: this.generateQuestionRecommendations(question)
        });
      }
    });

    return optimizations;
  }

  private static calculateEngagement(story: any) {
    if (!story.progress || story.progress.length === 0) return 1;
    
    const completions = story.progress.filter((p: any) => p.completed).length;
    return completions / story.progress.length;
  }

  private static calculateQuestionEffectiveness(question: any) {
    if (!question.attempts || question.attempts === 0) return 1;
    
    return question.correctAnswers / question.attempts;
  }

  private static generateStoryRecommendations(story: any) {
    const recommendations = [];

    if (story.content.length < 1000) {
      recommendations.push('Add more detailed content');
    }

    if (!story.content.includes('example') && !story.content.includes('instance')) {
      recommendations.push('Include real-world examples');
    }

    if (story.visualAids?.length < 2) {
      recommendations.push('Add more visual aids');
    }

    return recommendations;
  }

  private static generateQuestionRecommendations(question: any) {
    const recommendations = [];

    if (question.explanation.length < 100) {
      recommendations.push('Provide more detailed explanation');
    }

    if (question.options.length < 4) {
      recommendations.push('Add more answer options');
    }

    return recommendations;
  }

  private static async applyOptimizations(stateCode: string, optimizations: any) {
    // Apply story optimizations
    for (const story of optimizations.stories) {
      await prisma.story.update({
        where: { id: story.id },
        data: {
          needsReview: true,
          reviewNotes: JSON.stringify(story.recommendations)
        }
      });
    }

    // Apply question optimizations
    for (const question of optimizations.questions) {
      await prisma.question.update({
        where: { id: question.id },
        data: {
          needsReview: true,
          reviewNotes: JSON.stringify(question.recommendations)
        }
      });
    }

    // Log optimization results
    logger.info(`Content optimization completed for ${stateCode}`, {
      storiesOptimized: optimizations.stories.length,
      questionsOptimized: optimizations.questions.length
    });
  }
}