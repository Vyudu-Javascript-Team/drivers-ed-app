'use client';

import { useEffect, useState } from 'react';
import { useClient } from 'agora-rtc-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Video, Mic, MicOff, VideoOff, Users, MessageSquare } from 'lucide-react';
import { CollaborativeEditor } from './collaborative-editor';
import { useToast } from '@/hooks/use-toast';

interface StudySessionProps {
  sessionId: string;
  userId: string;
  userName: string;
}

export function StudySession({ sessionId, userId, userName }: StudySessionProps) {
  const client = useClient();
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    joinSession();
    return () => leaveSession();
  }, []);

  const joinSession = async () => {
    try {
      await client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        sessionId,
        null,
        userId
      );

      const audioTrack = await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => stream.getAudioTracks()[0]);
      
      const videoTrack = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => stream.getVideoTracks()[0]);

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await client.publish([audioTrack, videoTrack]);

      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-left', handleUserLeft);

      toast.success('Joined study session');
    } catch (error) {
      console.error('Failed to join session:', error);
      toast.error('Failed to join study session');
    }
  };

  const leaveSession = async () => {
    try {
      localAudioTrack?.close();
      localVideoTrack?.close();
      await client.leave();
      setParticipants([]);
      toast.success('Left study session');
    } catch (error) {
      console.error('Failed to leave session:', error);
    }
  };

  const handleUserPublished = async (user: any, mediaType: string) => {
    await client.subscribe(user, mediaType);
    setParticipants(prev => [...prev, user]);
  };

  const handleUserUnpublished = (user: any) => {
    setParticipants(prev => prev.filter(p => p.uid !== user.uid));
  };

  const handleUserLeft = (user: any) => {
    setParticipants(prev => prev.filter(p => p.uid !== user.uid));
  };

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.enabled = !isAudioEnabled;
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.enabled = !isVideoEnabled;
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId,
      userName,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-[600px]">
      <div className="col-span-2 space-y-4">
        <Card className="p-4 h-[500px] overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Local video */}
            <div className="relative">
              <video
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                playsInline
                muted
                ref={(el) => {
                  if (el) el.srcObject = new MediaStream([localVideoTrack]);
                }}
              />
              <div className="absolute bottom-4 left-4 space-x-2">
                <Button
                  size="sm"
                  variant={isAudioEnabled ? 'default' : 'destructive'}
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </Button>
                <Button
                  size="sm"
                  variant={isVideoEnabled ? 'default' : 'destructive'}
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video /> : <VideoOff />}
                </Button>
              </div>
            </div>

            {/* Remote videos */}
            {participants.map(participant => (
              <div key={participant.uid} className="relative">
                <video
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  playsInline
                  ref={(el) => {
                    if (el) el.srcObject = new MediaStream([participant.videoTrack]);
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        <CollaborativeEditor sessionId={sessionId} />
      </div>

      <Card className="p-4">
        <Tabs defaultValue="participants">
          <TabsList className="w-full">
            <TabsTrigger value="participants" className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{userName} (You)</span>
              </div>
              {participants.map(participant => (
                <div key={participant.uid} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>{participant.uid}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.userId === userId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.userId === userId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm font-medium">{message.userName}</p>
                      <p>{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}