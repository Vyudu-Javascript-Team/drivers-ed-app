import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserProgress {
  completedStories: string[]
  testScores: Record<string, number>
  currentState: string | null
}

interface AppState {
  userProgress: UserProgress
  addCompletedStory: (storyId: string) => void
  addTestScore: (testId: string, score: number) => void
  setCurrentState: (state: string) => void
  resetProgress: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      userProgress: {
        completedStories: [],
        testScores: {},
        currentState: null,
      },
      addCompletedStory: (storyId) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            completedStories: [...state.userProgress.completedStories, storyId],
          },
        })),
      addTestScore: (testId, score) =>
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            testScores: {
              ...state.userProgress.testScores,
              [testId]: score,
            },
          },
        })),
      setCurrentState: (state) =>
        set((prev) => ({
          userProgress: {
            ...prev.userProgress,
            currentState: state,
          },
        })),
      resetProgress: () =>
        set({
          userProgress: {
            completedStories: [],
            testScores: {},
            currentState: null,
          },
        }),
    }),
    {
      name: "drivers-ed-storage",
    }
  )
)