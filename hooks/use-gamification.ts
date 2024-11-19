import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { LevelInfo } from '@/lib/gamification'

export function useGamification() {
  const { data: session } = useSession()
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchLevelInfo()
    }
  }, [session])

  const fetchLevelInfo = async () => {
    try {
      const response = await fetch('/api/user/progress')
      const data = await response.json()
      setLevelInfo(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch level info:', error)
      setLoading(false)
    }
  }

  const handleXPGain = async (amount: number) => {
    if (!levelInfo) return

    const newXP = levelInfo.currentXP + amount
    const oldLevel = levelInfo.currentLevel
    const newLevelInfo = {
      ...levelInfo,
      currentXP: newXP,
    }

    // Optimistically update the UI
    setLevelInfo(newLevelInfo)

    // Show XP gain toast
    toast.success(`+${amount} XP`, {
      description: 'Keep up the good work!',
    })

    // Check for level up
    if (newXP >= levelInfo.nextLevelXP) {
      toast.success('Level Up!', {
        description: `You've reached level ${oldLevel + 1}!`,
      })
    }

    // Refresh level info from server
    await fetchLevelInfo()
  }

  return {
    levelInfo,
    loading,
    handleXPGain,
  }
}