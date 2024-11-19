import { prisma } from '@/lib/prisma'
import { LearningPatternAnalyzer } from './learning-patterns'
import { DifficultyAdjuster } from './difficulty-adjuster'
import { logger } from '@/lib/logger'

export interface Recommendation {
  type: 'STORY' | 'TEST' | 'REVIEW'
  title: string
  description: string
  priority: number
  resourceId: string
  reason: string
}

export class RecommendationEngine {
  static async generateRecommendations(userId: string): Promise<Recommendation[]> {
    try {
      // Get user's learning patterns
      const patterns = await LearningPatternAnalyzer.analyzeUserPatterns(userId)
      
      // Get current difficulty levels
      const difficulties = await prisma.userDifficulty.findMany({
        where: { userId },
      })

      const recommendations: Recommendation[] = []

      // Recommend content based on weak topics
      for (const topic of patterns.weakTopics) {
        const difficulty = difficulties.find(d => d.category === topic)?.level || 'EASY'
        
        // Find appropriate stories
        const stories = await prisma.story.findMany({
          where: {
            category: topic,
            difficulty,
            NOT: {
              progress: {
                some: {
                  userId,
                  completed: true,
                },
              },
            },
          },
          take: 2,
        })

        stories.forEach(story => {
          recommendations.push({
            type: 'STORY',
            title: story.title,
            description: story.description,
            priority: 1,
            resourceId: story.id,
            reason: `This story covers ${topic}, which you might want to review.`,
          })
        })

        // Find appropriate practice tests
        const tests = await prisma.test.findMany({
          where: {
            category: topic,
            difficulty,
          },
          take: 2,
        })

        tests.forEach(test => {
          recommendations.push({
            type: 'TEST',
            title: test.title,
            description: test.description,
            priority: 2,
            resourceId: test.id,
            reason: `Practice test focused on ${topic} to help improve your understanding.`,
          })
        })
      }

      // Recommend review of past mistakes
      if (Object.keys(patterns.mistakePatterns).length > 0) {
        const mostCommonMistakes = Object.entries(patterns.mistakePatterns)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)

        for (const [topic] of mostCommonMistakes) {
          recommendations.push({
            type: 'REVIEW',
            title: `Review ${topic}`,
            description: `Review materials for ${topic} to improve your understanding.`,
            priority: 3,
            resourceId: topic,
            reason: `You've had some challenges with questions about ${topic}.`,
          })
        }
      }

      // Sort recommendations by priority
      return recommendations.sort((a, b) => a.priority - b.priority)
    } catch (error) {
      logger.error('Failed to generate recommendations:', error)
      throw error
    }
  }
}