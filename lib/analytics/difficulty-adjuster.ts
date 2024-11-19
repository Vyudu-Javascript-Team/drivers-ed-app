import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface DifficultyLevel {
  userId: string
  category: string
  level: 'EASY' | 'MEDIUM' | 'HARD'
  confidence: number
}

export class DifficultyAdjuster {
  static readonly PERFORMANCE_THRESHOLD = {
    EASY_TO_MEDIUM: 80,
    MEDIUM_TO_HARD: 85,
    HARD_TO_MEDIUM: 60,
    MEDIUM_TO_EASY: 50,
  }

  static async adjustDifficulty(userId: string): Promise<DifficultyLevel[]> {
    try {
      const recentResults = await prisma.testResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { test: true },
      })

      const categoryPerformance = this.analyzeCategoryPerformance(recentResults)
      const adjustedLevels = this.calculateNewLevels(categoryPerformance)

      // Store the new difficulty levels
      await Promise.all(
        adjustedLevels.map(level =>
          prisma.userDifficulty.upsert({
            where: {
              userId_category: {
                userId,
                category: level.category,
              },
            },
            update: {
              level: level.level,
              confidence: level.confidence,
            },
            create: {
              userId,
              category: level.category,
              level: level.level,
              confidence: level.confidence,
            },
          })
        )
      )

      return adjustedLevels
    } catch (error) {
      logger.error('Failed to adjust difficulty:', error)
      throw error
    }
  }

  private static analyzeCategoryPerformance(results: any[]) {
    const performance: Record<string, { scores: number[]; currentLevel: string }> = {}

    results.forEach(result => {
      const category = result.test.category
      if (!performance[category]) {
        performance[category] = {
          scores: [],
          currentLevel: result.test.difficulty,
        }
      }
      performance[category].scores.push(result.score)
    })

    return performance
  }

  private static calculateNewLevels(
    performance: Record<string, { scores: number[]; currentLevel: string }>
  ): DifficultyLevel[] {
    return Object.entries(performance).map(([category, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      const confidence = Math.min(data.scores.length / 5, 1) // Confidence based on number of attempts

      let newLevel: DifficultyLevel['level'] = data.currentLevel as DifficultyLevel['level']

      if (data.currentLevel === 'EASY' && avgScore >= this.PERFORMANCE_THRESHOLD.EASY_TO_MEDIUM) {
        newLevel = 'MEDIUM'
      } else if (data.currentLevel === 'MEDIUM') {
        if (avgScore >= this.PERFORMANCE_THRESHOLD.MEDIUM_TO_HARD) {
          newLevel = 'HARD'
        } else if (avgScore <= this.PERFORMANCE_THRESHOLD.MEDIUM_TO_EASY) {
          newLevel = 'EASY'
        }
      } else if (data.currentLevel === 'HARD' && avgScore <= this.PERFORMANCE_THRESHOLD.HARD_TO_MEDIUM) {
        newLevel = 'MEDIUM'
      }

      return {
        category,
        level: newLevel,
        confidence,
        userId: performance[category].scores[0]?.userId,
      }
    })
  }
}