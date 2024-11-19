'use client'

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

interface LevelProgressProps {
  level: number
  currentXP: number
  nextLevelXP: number
  totalXP: number
}

export function LevelProgress({
  level,
  currentXP,
  nextLevelXP,
  totalXP,
}: LevelProgressProps) {
  const progress = (currentXP / nextLevelXP) * 100

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Level {level}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Total XP: {totalXP}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{currentXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        <Progress value={progress} />
        <p className="text-xs text-center text-muted-foreground">
          {(nextLevelXP - currentXP)} XP until next level
        </p>
      </div>
    </Card>
  )
}