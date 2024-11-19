'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { socket } from '@/lib/socket';
import { notificationManager } from '@/lib/notifications';

interface ProgressIndicatorProps {
  total: number;
  current: number;
  type: 'story' | 'test';
  onComplete?: () => void;
}

export function ProgressIndicator({ total, current, type, onComplete }: ProgressIndicatorProps) {
  const [progress, setProgress] = useState((current / total) * 100);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const newProgress = (current / total) * 100;
    setProgress(newProgress);

    // Emit progress update
    socket.emit('progressUpdate', {
      type,
      progress: newProgress,
      timestamp: Date.now(),
    });

    // Check for milestones
    if (newProgress >= 25 && progress < 25) {
      notificationManager.sendNotification('25% Complete!', {
        body: `You're making great progress on this ${type}!`,
      });
    } else if (newProgress >= 50 && progress < 50) {
      notificationManager.sendNotification('Halfway There!', {
        body: 'Keep going, you\'re doing great!',
      });
    } else if (newProgress >= 75 && progress < 75) {
      notificationManager.sendNotification('Almost Done!', {
        body: 'Just a little more to go!',
      });
    } else if (newProgress >= 100 && progress < 100) {
      notificationManager.sendNotification('Completed!', {
        body: `Congratulations! You've completed this ${type}!`,
      });
      onComplete?.();
    }

    setLastUpdate(Date.now());
  }, [current, total]);

  return (
    <div className="space-y-2">
      <Progress value={progress} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{Math.round(progress)}% Complete</span>
        <span>
          {type === 'test' && `${Math.floor((total - current) / 60)}:${((total - current) % 60).toString().padStart(2, '0')} remaining`}
        </span>
      </div>
    </div>
  );
}