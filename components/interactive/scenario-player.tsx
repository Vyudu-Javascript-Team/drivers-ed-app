'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrafficScenario } from './traffic-scenario';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ScenarioPlayerProps {
  scenario: any;
  onComplete: (success: boolean) => void;
}

export function ScenarioPlayer({ scenario, onComplete }: ScenarioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            setIsPlaying(false);
            onComplete(true);
            toast.success('Scenario completed successfully!');
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleCollision = () => {
    setIsPlaying(false);
    setAttempts(prev => prev + 1);
    toast.error('Collision detected! Try again.');
    if (attempts >= 2) {
      toast({
        title: 'Hint',
        description: scenario.hint || 'Watch out for other vehicles and maintain safe distances.',
      });
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{scenario.title}</h3>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <TrafficScenario
            width={scenario.content.width}
            height={scenario.content.height}
            vehicles={scenario.content.vehicles}
            onCollision={handleCollision}
            isPlaying={isPlaying}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {attempts > 0 && (
          <p className="text-sm text-muted-foreground">
            Attempts: {attempts}
          </p>
        )}
      </div>
    </Card>
  )
}