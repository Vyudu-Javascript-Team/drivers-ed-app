"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, BarChart } from "lucide-react";

interface AdaptiveDifficultyControlsProps {
  currentDifficulty: "EASY" | "MEDIUM" | "HARD";
  adaptiveMode: boolean;
  performance: {
    recentScores: number[];
    averageScore: number;
    trend: "IMPROVING" | "STABLE" | "DECLINING";
  };
  onDifficultyChange: (difficulty: "EASY" | "MEDIUM" | "HARD") => void;
  onAdaptiveModeChange: (enabled: boolean) => void;
}

export function AdaptiveDifficultyControls({
  currentDifficulty,
  adaptiveMode,
  performance,
  onDifficultyChange,
  onAdaptiveModeChange,
}: AdaptiveDifficultyControlsProps) {
  const [showStats, setShowStats] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "HARD":
        return "text-red-500";
      default:
        return "";
    }
  };

  const getTrendIcon = () => {
    switch (performance.trend) {
      case "IMPROVING":
        return <ArrowUp className="text-green-500" />;
      case "DECLINING":
        return <ArrowDown className="text-red-500" />;
      default:
        return <BarChart className="text-yellow-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Difficulty Settings</h3>
            <p className="text-sm text-muted-foreground">
              Current Level:{" "}
              <span className={getDifficultyColor(currentDifficulty)}>
                {currentDifficulty}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="adaptive-mode">Adaptive Mode</Label>
            <Switch
              id="adaptive-mode"
              checked={adaptiveMode}
              onCheckedChange={onAdaptiveModeChange}
            />
          </div>
        </div>

        {!adaptiveMode && (
          <div className="space-y-2">
            <Label>Manual Difficulty Selection</Label>
            <Select
              value={currentDifficulty}
              onValueChange={(value: "EASY" | "MEDIUM" | "HARD") =>
                onDifficultyChange(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? "Hide Stats" : "Show Stats"}
          </Button>

          {showStats && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Score</span>
                  <span>{performance.averageScore}%</span>
                </div>
                <Progress value={performance.averageScore} />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {performance.recentScores.map((score, index) => (
                  <div
                    key={index}
                    className="h-20 bg-secondary rounded-lg relative overflow-hidden"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary transition-all"
                      style={{ height: `${score}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Performance Trend</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <span className="text-sm font-medium">{performance.trend}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}