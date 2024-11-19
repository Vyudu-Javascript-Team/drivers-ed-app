import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Lock } from "lucide-react";

interface StoryCardProps {
  id: string;
  title: string;
  description: string;
  progress?: number;
  isLocked?: boolean;
  state: string;
}

export function StoryCard({
  id,
  title,
  description,
  progress = 0,
  isLocked = false,
  state,
}: StoryCardProps) {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {isLocked && (
            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </div>

      <Button
        className="w-full mt-6"
        variant={isLocked ? "secondary" : "default"}
        asChild
      >
        <Link href={isLocked ? "/pricing" : `/stories/${state}/${id}`}>
          <BookOpen className="mr-2 h-4 w-4" />
          {progress > 0 ? "Continue Story" : "Start Story"}
        </Link>
      </Button>
    </Card>
  );
}