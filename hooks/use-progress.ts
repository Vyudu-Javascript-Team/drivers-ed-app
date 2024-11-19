import { useStore } from "@/lib/state/store"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useProgress() {
  const queryClient = useQueryClient()
  const { userProgress, addCompletedStory, addTestScore } = useStore()

  const { data: serverProgress, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      const response = await fetch("/api/progress")
      if (!response.ok) throw new Error("Failed to fetch progress")
      return response.json()
    },
  })

  const syncMutation = useMutation({
    mutationFn: async (progress: any) => {
      const response = await fetch("/api/progress/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progress),
      })
      if (!response.ok) throw new Error("Failed to sync progress")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] })
    },
  })

  const completeStory = async (storyId: string) => {
    addCompletedStory(storyId)
    await syncMutation.mutateAsync({
      ...userProgress,
      completedStories: [...userProgress.completedStories, storyId],
    })
  }

  const saveTestScore = async (testId: string, score: number) => {
    addTestScore(testId, score)
    await syncMutation.mutateAsync({
      ...userProgress,
      testScores: { ...userProgress.testScores, [testId]: score },
    })
  }

  return {
    progress: serverProgress || userProgress,
    isLoading,
    completeStory,
    saveTestScore,
  }
}