import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"

export function XPProgress() {
  const { levelInfo, loading } = useGamification()

  if (loading || !levelInfo) {
    return null
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Level {levelInfo.currentLevel}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{levelInfo.currentXP} XP</span>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={levelInfo.progress} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Level {levelInfo.currentLevel}</span>
          <span>{levelInfo.nextLevelXP - levelInfo.currentXP} XP to next level</span>
        </div>
      </div>
    </Card>
  )
}