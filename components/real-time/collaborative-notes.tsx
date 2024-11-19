'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { socket } from '@/lib/socket';
import { Save, Share, Users } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  collaborators: string[];
  lastUpdated: Date;
}

export function CollaborativeNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    socket.on('noteUpdate', (updatedNote: Note) => {
      setNotes(prev =>
        prev.map(note =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      
      if (activeNote?.id === updatedNote.id) {
        setActiveNote(updatedNote);
      }
    });

    return () => {
      socket.off('noteUpdate');
    };
  }, [activeNote]);

  const saveNote = () => {
    if (!activeNote) return;

    socket.emit('saveNote', {
      ...activeNote,
      content: editedContent,
      lastUpdated: new Date(),
    });
  };

  const shareNote = () => {
    if (!activeNote) return;

    socket.emit('shareNote', {
      noteId: activeNote.id,
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Study Notes</h3>
          <div className="space-x-2">
            <Button variant="outline" onClick={shareNote}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={saveNote}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {activeNote && (
          <div className="space-y-4">
            <Input
              value={activeNote.title}
              onChange={(e) =>
                setActiveNote({ ...activeNote, title: e.target.value })
              }
              placeholder="Note title"
            />
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Start taking notes..."
              className="min-h-[200px]"
            />
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {activeNote.collaborators.length} collaborators
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Recent Notes</h4>
          <div className="space-y-2">
            {notes.map(note => (
              <Button
                key={note.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveNote(note);
                  setEditedContent(note.content);
                }}
              >
                <div className="flex flex-col items-start">
                  <span>{note.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Last updated:{' '}
                    {new Date(note.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}