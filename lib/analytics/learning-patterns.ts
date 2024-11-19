import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface LearningPattern {
  preferredTimeOfDay: string
  averageSessionDuration: number
  strongTopics: string[]
  weakTopics: string[]
  completionRate: number
  mistakePatterns: Record<string, number>
}

export class LearningPatternAnalyzer {
  static async analyzeUserPatterns(userId: string): Promise<LearningPattern> {
    try {
      // Analyze session timing and duration
      const sessions = await prisma.userSession.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' },
        take: 50,
      })

      const timeDistribution = this.analyzeTimeDistribution(sessions)
      const avgDuration = this.calculateAverageSessionDuration(sessions)

      // Analyze test results and story progress
      const testResults = await prisma.testResult.findMany({
        where: { userId },
        include: { test: true },
      })

      const storyProgress = await prisma.storyProgress.findMany({
        where: { userId },
        include: { story: true },
      })

      const { strongTopics, weakTopics } = this.analyzeTopicStrengths(testResults)
      const completionRate = this.calculateCompletionRate(storyProgress)
      const mistakePatterns = this.analyzeMistakePatterns(testResults)

      return {
        preferredTimeOfDay: timeDistribution,
        averageSessionDuration: avgDuration,
        strongTopics,
        weakTopics,
        completionRate,
        mistakePatterns,
      }
    } catch (error) {
      logger.error('Failed to analyze learning patterns:', error)
      throw error
    }
  }

  private static analyzeTimeDistribution(sessions: any[]): string {
    const hours = sessions.map(s => new Date(s.startTime).getHours())
    const timeSlots = {
      morning: hours.filter(h => h >= 5 && h < 12).length,
      afternoon: hours.filter(h => h >= 12 && h < 17).length,
      evening: hours.filter(h => h >= 17 && h < 22).length,
      night: hours.filter(h => h >= 22 || h < 5).length,
    }

    return Object.entries(timeSlots).reduce((a, b) => 
      timeSlots[a as keyof typeof timeSlots] > timeSlots[b[0] as keyof typeof timeSlots] ? a : b[0]
    )
  }

  private static calculateAverageSessionDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0
    const durations = sessions.map(s => 
      (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1000 / 60
    )
    return durations.reduce((a, b) => a + b, 0) / sessions.length
  }

  private static analyzeTopicStrengths(testResults: any[]) {
    const topicScores: Record<string, { total: number; count: number }> = {}

    testResults.forEach(result => {
      const topic = result.test.category
      if (!topicScores[topic]) {
        topicScores[topic] = { total: 0, count: 0 }
      }
      topicScores[topic].total += result.score
      topicScores[topic].count++
    })

    const averageScores = Object.entries(topicScores).map(([topic, scores]) => ({
      topic,
      average: scores.total / scores.count,
    }))

    const strongTopics = averageScores
      .filter(score => score.average >= 80)
      .map(score => score.topic)

    const weakTopics = averageScores
      .filter(score => score.average < 60)
      .map(score => score.topic)

    return { strongTopics, weakTopics }
  }

  private static calculateCompletionRate(progress: any[]): number {
    if (progress.length === 0) return 0
    const completed = progress.filter(p => p.completed).length
    return (completed / progress.length) * 100
  }

  private static analyzeMistakePatterns(testResults: any[]): Record<string, number> {
    const mistakes: Record<string, number> = {}

    testResults.forEach(result => {
      result.answers.forEach((answer: number, index: number) => {
        const question = result.test.questions[index]
        if (answer !== question.correctAnswer) {
          const topic = question.category
          mistakes[topic] = (mistakes[topic] || 0) + 1
        }
      })
    })

    return mistakes
  }
}