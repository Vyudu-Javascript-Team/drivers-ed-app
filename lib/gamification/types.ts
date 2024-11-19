export enum AchievementType {
  // Learning Progress
  STORY_COMPLETE = 'STORY_COMPLETE',
  STORY_MASTER = 'STORY_MASTER',
  STATE_MASTER = 'STATE_MASTER',
  NATIONAL_EXPERT = 'NATIONAL_EXPERT',

  // Test Performance
  PERFECT_SCORE = 'PERFECT_SCORE',
  TEST_ACE = 'TEST_ACE',
  QUICK_LEARNER = 'QUICK_LEARNER',
  CONSISTENCY_KING = 'CONSISTENCY_KING',

  // Engagement
  STREAK_WARRIOR = 'STREAK_WARRIOR',
  DAILY_DEDICATION = 'DAILY_DEDICATION',
  WEEKEND_WARRIOR = 'WEEKEND_WARRIOR',
  NIGHT_OWL = 'NIGHT_OWL',

  // Social
  HELPFUL_HERO = 'HELPFUL_HERO',
  COMMUNITY_CHAMPION = 'COMMUNITY_CHAMPION',
  LEADERBOARD_LEGEND = 'LEADERBOARD_LEGEND',

  // Special Events
  EARLY_BIRD = 'EARLY_BIRD',
  SEASONAL_STAR = 'SEASONAL_STAR',
  CHALLENGE_CHAMPION = 'CHALLENGE_CHAMPION'
}

export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt?: Date;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  progress?: number;
  maxProgress?: number;
}

export interface XPEvent {
  amount: number;
  reason: string;
  timestamp: Date;
  bonusMultiplier?: number;
}

export interface Level {
  current: number;
  xp: number;
  nextLevelXp: number;
  progress: number;
  rewards: LevelReward[];
}

export interface LevelReward {
  type: 'BADGE' | 'TITLE' | 'THEME' | 'BONUS_XP' | 'SPECIAL_ACCESS';
  value: string;
  description: string;
}

export interface Streak {
  current: number;
  longest: number;
  lastActivity: Date;
  multiplier: number;
}