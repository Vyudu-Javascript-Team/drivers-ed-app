'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { socket } from '@/lib/socket';

interface Activity {
  userId: string;
  userName: string;
  userImage?: string;
  type: 'story' | 'test' | 'achievement';
  title: string;
  timestamp: Date;
}

export function LiveActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    socket.on('activity', (activity: Activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('activity');
    };
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Live Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 text-sm text-muted-foreground"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.userImage} />
              <AvatarFallback>{activity.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-medium text-foreground">
                {activity.userName}
              </span>{' '}
              {activity.type === 'story'
                ? 'is reading'
                : activity.type === 'test'
                ? 'is taking'
                : 'earned'}{' '}
              {activity.title}
            </div>
            <time className="text-xs">
              {new Date(activity.timestamp).toLocaleTimeString()}
            </time>
          </div>
        ))}
      </div>
    </Card>
  );
}