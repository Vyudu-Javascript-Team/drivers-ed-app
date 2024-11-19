'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ClipboardList, Timer, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PracticeTestCardProps {
  title: string
  description: string
  questionsCount: number
  timeLimit: number
  bestScore?: number
  attempts?: number
  testId: string
}

export function PracticeTestCard({
  title,
  description,
  questionsCount,
  timeLimit,
  bestScore,
  attempts = 0,
  testId,
}: PracticeTestCardProps) {
  const router = useRouter()

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{questionsCount} Questions</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{timeLimit} Minutes</span>
        </div>
      </div>

      {bestScore && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Best Score: {bestScore}%</span>
          </div>
          <Progress value={bestScore} />
        </div>
      )}

      {attempts > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Previous attempts: {attempts}
        </p>
      )}

      <Button 
        className="w-full"
        onClick={() => router.push(`/practice/${testId}`)}
      >
        Start Test
      </Button>
    </Card>
  )
}