import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  xpRequired: number;
  icon: string;
  unlockedAt?: Date;
}

interface GamificationState {
  xp: number;
  level: number;
  achievements: Achievement[];
  unlockedAchievements: string[];
  addXP: (amount: number) => Promise<void>;
  checkAchievements: () => void;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_test',
    title: 'First Steps',
    description: 'Complete your first practice test',
    xpRequired: 10,
    icon: '🎯'
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Get 100% on a practice test',
    xpRequired: 100,
    icon: '🏆'
  },
  {
    id: 'study_streak',
    title: 'Study Streak',
    description: 'Study for 5 days in a row',
    xpRequired: 250,
    icon: '🔥'
  },
  {
    id: 'knowledge_master',
    title: 'Knowledge Master',
    description: 'Complete all state-specific content',
    xpRequired: 500,
    icon: '📚'
  },
  {
    id: 'test_ace',
    title: 'Test Ace',
    description: 'Pass 10 practice tests',
    xpRequired: 1000,
    icon: '🌟'
  }
];

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      achievements: ACHIEVEMENTS,
      unlockedAchievements: [],

      addXP: async (amount: number) => {
        const currentXP = get().xp;
        const currentLevel = get().level;
        const newXP = currentXP + amount;
        const newLevel = calculateLevel(newXP);

        set({ xp: newXP });

        if (newLevel > currentLevel) {
          set({ level: newLevel });
          toast.success(`Level Up! You're now level ${newLevel} 🎉`);
          
          // Save progress to backend
          try {
            await fetch('/api/user/progress', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ xp: newXP, level: newLevel }),
            });
          } catch (error) {
            console.error('Failed to save progress:', error);
          }
        }

        get().checkAchievements();
      },

      checkAchievements: () => {
        const { xp, achievements, unlockedAchievements } = get();

        achievements.forEach((achievement) => {
          if (
            xp >= achievement.xpRequired &&
            !unlockedAchievements.includes(achievement.id)
          ) {
            set({
              unlockedAchievements: [...unlockedAchievements, achievement.id],
            });

            // Update achievement in database
            fetch('/api/user/achievements', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ achievementId: achievement.id }),
            }).catch(console.error);

            toast.success(
              <div className="flex flex-col gap-1">
                <p className="font-bold">Achievement Unlocked! 🏆</p>
                <p>{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>,
              {
                duration: 5000,
              }
            );
          }
        });
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
);