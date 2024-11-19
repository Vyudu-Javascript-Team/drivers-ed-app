export class LeaderboardSystem {
  static readonly PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME'] as const;
  static readonly CATEGORIES = ['OVERALL', 'STATE_SPECIFIC', 'CATEGORY_SPECIFIC'] as const;
  static readonly ACHIEVEMENTS = ['FIRST_PLACE', 'TOP_3', 'TOP_10', 'CONSISTENT_PERFORMER'] as const;

  static async updateLeaderboard(userId: string, score: number, context: {
    state: string;
    category?: string;
    timestamp: Date;
  }) {
    try {
      // Update all relevant leaderboards
      await Promise.all([
        this.updatePeriodLeaderboard('DAILY', userId, score, context),
        this.updatePeriodLeaderboard('WEEKLY', userId, score, context),
        this.updatePeriodLeaderboard('MONTHLY', userId, score, context),
        this.updatePeriodLeaderboard('ALL_TIME', userId, score, context)
      ]);

      // Check for achievements
      await this.checkLeaderboardAchievements(userId, context.state);

      // Update user stats
      await this.updateUserStats(userId, score, context);

      // Emit real-time updates
      await this.emitLeaderboardUpdates(userId, context.state);
    } catch (error) {
      console.error('Failed to update leaderboard:', error);
      throw error;
    }
  }

  static async getLeaderboard(options: {
    period: typeof LeaderboardSystem.PERIODS[number];
    state?: string;
    category?: string;
    limit?: number;
  }) {
    const { period, state, category, limit = 100 } = options;

    const leaderboard = await prisma.leaderboard.findMany({
      where: {
        period,
        ...(state && { state }),
        ...(category && { category })
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            level: true,
            achievements: {
              where: {
                type: { in: this.ACHIEVEMENTS }
              }
            }
          }
        }
      },
      orderBy: [
        { score: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: limit
    });

    return this.enrichLeaderboardData(leaderboard);
  }

  private static async enrichLeaderboardData(leaderboard: any[]) {
    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      rankChange: await this.calculateRankChange(entry),
      achievements: this.processAchievements(entry.user.achievements),
      stats: {
        winStreak: entry.user.stats?.winStreak || 0,
        bestScore: entry.user.stats?.bestScore || 0,
        totalTests: entry.user.stats?.totalTests || 0
      }
    }));
  }

  private static async calculateRankChange(entry: any) {
    const previousRank = await prisma.leaderboardHistory.findFirst({
      where: {
        userId: entry.userId,
        period: entry.period,
        timestamp: {
          lt: entry.updatedAt
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      select: { rank: true }
    });

    return previousRank ? previousRank.rank - entry.rank : 0;
  }

  private static async checkLeaderboardAchievements(userId: string, state: string) {
    const rankings = await this.getUserRankings(userId, state);
    
    const achievements = [];
    
    if (rankings.daily === 1) {
      achievements.push({
        type: 'DAILY_CHAMPION',
        title: 'Daily Champion',
        description: 'Reached #1 on the daily leaderboard',
        xpReward: 500
      });
    }

    if (rankings.weekly <= 3) {
      achievements.push({
        type: 'WEEKLY_ELITE',
        title: 'Weekly Elite',
        description: 'Finished in the top 3 for the week',
        xpReward: 1000
      });
    }

    // Award achievements
    await Promise.all(
      achievements.map(achievement =>
        prisma.achievement.create({
          data: {
            userId,
            ...achievement,
            unlockedAt: new Date()
          }
        })
      )
    );
  }

  private static async getUserRankings(userId: string, state: string) {
    const rankings = await Promise.all(
      this.PERIODS.map(period =>
        prisma.leaderboard.count({
          where: {
            period,
            state,
            score: {
              gt: prisma.leaderboard.findFirst({
                where: { userId, period, state },
                select: { score: true }
              })
            }
          }
        })
      )
    );

    return {
      daily: rankings[0] + 1,
      weekly: rankings[1] + 1,
      monthly: rankings[2] + 1,
      allTime: rankings[3] + 1
    };
  }

  private static async updateUserStats(userId: string, score: number, context: any) {
    await prisma.userStats.upsert({
      where: { userId },
      update: {
        totalTests: { increment: 1 },
        totalScore: { increment: score },
        bestScore: {
          set: prisma.raw(`GREATEST(best_score, ${score})`)
        }
      },
      create: {
        userId,
        totalTests: 1,
        totalScore: score,
        bestScore: score
      }
    });
  }

  private static async emitLeaderboardUpdates(userId: string, state: string) {
    // Implementation for real-time updates would go here
    // This would typically integrate with a WebSocket or real-time service
  }
}