'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  xpReward: number;
  progress?: number;
  maxProgress?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

const rarityColors = {
  COMMON: 'bg-gray-100 text-gray-900',
  RARE: 'bg-blue-100 text-blue-900',
  EPIC: 'bg-purple-100 text-purple-900',
  LEGENDARY: 'bg-yellow-100 text-yellow-900',
};

const rarityBorders = {
  COMMON: 'border-gray-200',
  RARE: 'border-blue-200',
  EPIC: 'border-purple-200',
  LEGENDARY: 'border-yellow-200 animate-pulse',
};

export function AchievementCard({
  title,
  description,
  icon,
  rarity,
  xpReward,
  progress = 0,
  maxProgress = 100,
  isUnlocked,
  unlockedAt,
}: AchievementCardProps) {
  const progressPercentage = (progress / maxProgress) * 100;

  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      isUnlocked ? rarityBorders[rarity] : "opacity-75",
      isUnlocked && "hover:scale-105"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
            rarityColors[rarity]
          )}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {!isUnlocked && <Lock className="h-5 w-5 text-muted-foreground" />}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={isUnlocked ? "default" : "secondary"}>
            {rarity}
          </Badge>
          <Badge variant="outline">
            +{xpReward} XP
          </Badge>
        </div>

        {maxProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress} / {maxProgress}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        )}

        {isUnlocked && unlockedAt && (
          <p className="text-xs text-muted-foreground text-right">
            Unlocked {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}