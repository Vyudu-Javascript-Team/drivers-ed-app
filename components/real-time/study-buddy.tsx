'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { socket } from '@/lib/socket';
import { Users, MessageSquare, Video } from 'lucide-react';

interface StudyBuddy {
  id: string;
  name: string;
  image?: string;
  state: string;
  status: 'online' | 'studying' | 'offline';
}

export function StudyBuddy() {
  const [buddies, setBuddies] = useState<StudyBuddy[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<StudyBuddy | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('buddyStatusChange', (data) => {
      setBuddies(prev => 
        prev.map(buddy => 
          buddy.id === data.userId 
            ? { ...buddy, status: data.status }
            : buddy
        )
      );
    });

    socket.on('studyInvite', (data) => {
      // Handle study invitation
    });

    return () => {
      socket.off('buddyStatusChange');
      socket.off('studyInvite');
    };
  }, []);

  const sendMessage = () => {
    if (!selectedBuddy || !message.trim()) return;

    socket.emit('message', {
      to: selectedBuddy.id,
      content: message,
    });
    setMessage('');
  };

  const inviteToStudy = (buddy: StudyBuddy) => {
    socket.emit('studyInvite', {
      to: buddy.id,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Study Buddies</h3>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Find Buddies
          </Button>
        </div>

        <div className="divide-y">
          {buddies.map(buddy => (
            <div
              key={buddy.id}
              className="py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={buddy.image} />
                  <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{buddy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {buddy.state} • {buddy.status}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBuddy(buddy)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => inviteToStudy(buddy)}
                >
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedBuddy && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}