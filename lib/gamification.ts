import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export interface LevelInfo {
  currentLevel: number
  currentXP: number
  nextLevelXP: number
  progress: number
}

export class GamificationSystem {
  static calculateLevel(xp: number): LevelInfo {
    const baseXP = 1000 // XP needed for first level
    const currentLevel = Math.floor(xp / baseXP) + 1
    const currentLevelXP = (currentLevel - 1) * baseXP
    const nextLevelXP = currentLevel * baseXP
    const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

    return {
      currentLevel,
      currentXP: xp,
      nextLevelXP,
      progress,
    }
  }

  static async awardXP(userId: string, amount: number, reason: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true },
      })

      if (!user) {
        throw new Error('User not found')
      }

      const newXP = user.xp + amount
      const currentLevel = this.calculateLevel(user.xp)
      const newLevel = this.calculateLevel(newXP)

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel.currentLevel,
        },
      })

      // Check for level up
      if (newLevel.currentLevel > currentLevel.currentLevel) {
        await this.handleLevelUp(userId, newLevel.currentLevel)
      }

      logger.info('XP awarded', {
        userId,
        amount,
        reason,
        newTotal: newXP,
        levelUp: newLevel.currentLevel > currentLevel.currentLevel,
      })

      return updatedUser
    } catch (error) {
      logger.error('Failed to award XP', { userId, amount, reason, error })
      throw error
    }
  }

  static async handleLevelUp(userId: string, newLevel: number) {
    try {
      // Create level-up achievement
      await prisma.achievement.create({
        data: {
          userId,
          type: 'LEVEL_UP',
          title: `Reached Level ${newLevel}`,
          description: `Congratulations! You've reached level ${newLevel}`,
          xpReward: 100,
        },
      })

      // Award bonus XP for leveling up
      await this.awardXP(userId, 100, 'Level up bonus')
    } catch (error) {
      logger.error('Failed to handle level up', { userId, newLevel, error })
      throw error
    }
  }

  static async updateLeaderboard(userId: string, state: string, score: number) {
    try {
      // Update weekly leaderboard
      await prisma.leaderboard.upsert({
        where: {
          id: `${userId}-${state}-weekly`,
        },
        update: {
          score: { increment: score },
          updatedAt: new Date(),
        },
        create: {
          id: `${userId}-${state}-weekly`,
          userId,
          state,
          score,
          period: 'weekly',
        },
      })

      // Update all-time leaderboard
      await prisma.leaderboard.upsert({
        where: {
          id: `${userId}-${state}-allTime`,
        },
        update: {
          score: { increment: score },
          updatedAt: new Date(),
        },
        create: {
          id: `${userId}-${state}-allTime`,
          userId,
          state,
          score,
          period: 'allTime',
        },
      })
    } catch (error) {
      logger.error('Failed to update leaderboard', { userId, state, score, error })
      throw error
    }
  }
}