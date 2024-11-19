import { prisma } from '@/lib/prisma';
import { notificationManager } from '@/lib/notifications';
import { socket } from '@/lib/socket';
import { logger } from '@/lib/logger';

export const ACHIEVEMENT_TYPES = {
  // Learning Progress
  FIRST_STORY: 'Complete your first story',
  STORY_MASTER: 'Complete 10 stories',
  STATE_EXPERT: 'Master all content for one state',
  NATIONAL_CHAMPION: 'Master content for all states',
  
  // Test Performance
  PERFECT_SCORE: 'Score 100% on a test',
  TEST_ACE: 'Score 90%+ on 5 consecutive tests',
  SPEED_DEMON: 'Complete a test in record time with 90%+ score',
  CONSISTENCY_KING: 'Maintain 85%+ average over 20 tests',
  
  // Engagement
  DAILY_STREAK_7: '7-day learning streak',
  DAILY_STREAK_30: '30-day learning streak',
  WEEKEND_WARRIOR: 'Study on 4 consecutive weekends',
  NIGHT_OWL: 'Complete 10 late-night sessions',
  
  // Social
  HELPFUL_HERO: 'Help 10 other students',
  COMMUNITY_LEADER: 'Top contributor in your state',
  LEADERBOARD_CHAMPION: 'Reach #1 on state leaderboard',
  
  // Special
  EARLY_ADOPTER: 'Join during launch month',
  SEASONAL_STAR: 'Complete all seasonal challenges',
  CHALLENGE_MASTER: 'Win a monthly challenge'
} as const;

export class AchievementManager {
  static async checkAndAwardAchievements(userId: string) {
    try {
      await Promise.all([
        this.checkLearningAchievements(userId),
        this.checkTestAchievements(userId),
        this.checkEngagementAchievements(userId),
        this.checkSocialAchievements(userId),
        this.checkSpecialAchievements(userId)
      ]);
    } catch (error) {
      logger.error('Failed to check achievements:', error);
    }
  }

  private static async awardAchievement(userId: string, type: string) {
    const existing = await prisma.achievement.findFirst({
      where: { userId, type }
    });

    if (existing) return;

    const achievement = await prisma.achievement.create({
      data: {
        userId,
        type,
        title: ACHIEVEMENT_TYPES[type as keyof typeof ACHIEVEMENT_TYPES],
        description: this.getAchievementDescription(type),
        xpReward: this.getXPReward(type),
        icon: this.getAchievementIcon(type),
        rarity: this.getAchievementRarity(type),
        unlockedAt: new Date()
      }
    });

    // Update user XP
    await prisma.userProgress.update({
      where: { userId },
      data: { xp: { increment: achievement.xpReward } }
    });

    // Send notifications
    await notificationManager.sendNotification(
      userId,
      'Achievement Unlocked! 🏆',
      `You've earned the "${achievement.title}" achievement!`
    );

    // Emit socket event for real-time updates
    socket.emit('achievementUnlocked', {
      userId,
      achievement
    });

    return achievement;
  }

  // Implementation of check methods and helper functions...
}