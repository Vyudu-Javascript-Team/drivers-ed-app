'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface StoryCardProps {
  title: string
  description: string
  progress?: number
  isLocked?: boolean
  storyId: string
  state: string
}

export function StoryCard({
  title,
  description,
  progress = 0,
  isLocked = false,
  storyId,
  state,
}: StoryCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartStory = async () => {
    if (isLocked) {
      toast.error('Please subscribe to access this story')
      router.push('/pricing')
      return
    }

    setLoading(true)
    try {
      // Here you would typically make an API call to start/resume the story
      router.push(`/states/${state}/stories/${storyId}`)
    } catch (error) {
      toast.error('Failed to start story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {isLocked && (
          <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
        )}
      </div>
      
      {progress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      <Button 
        className="w-full" 
        onClick={handleStartStory}
        disabled={loading}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        {progress > 0 ? 'Continue Story' : 'Start Story'}
      </Button>
    </Card>
  )
}