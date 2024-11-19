"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useGamification } from "@/hooks/use-gamification";

interface StoryProgressProps {
  storyId: string;
}

export function StoryProgress({ storyId }: StoryProgressProps) {
  const [progress, setProgress] = useState(0);
  const { handleXPGain } = useGamification();

  useEffect(() => {
    // Load initial progress
    fetchProgress();
  }, [storyId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}/progress`);
      const data = await response.json();
      setProgress(data.progress || 0);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const updateProgress = async (newProgress: number) => {
    try {
      const response = await fetch(`/api/stories/${storyId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      setProgress(newProgress);

      // Award XP for progress milestones
      if (newProgress >= 25 && progress < 25) {
        handleXPGain(50);
        toast.success("25% Complete! +50 XP");
      } else if (newProgress >= 50 && progress < 50) {
        handleXPGain(100);
        toast.success("Halfway there! +100 XP");
      } else if (newProgress >= 75 && progress < 75) {
        handleXPGain(150);
        toast.success("Almost done! +150 XP");
      } else if (newProgress === 100 && progress < 100) {
        handleXPGain(200);
        toast.success("Story Complete! +200 XP");
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      toast.error("Failed to update progress");
    }
  };

  return (
    <div className="mb-8 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}