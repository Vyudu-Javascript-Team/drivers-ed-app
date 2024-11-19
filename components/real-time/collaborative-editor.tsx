'use client';

import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface CollaborativeEditorProps {
  sessionId: string;
}

export function CollaborativeEditor({ sessionId }: CollaborativeEditorProps) {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    const ydoc = new Y.Doc();
    const yprovider = new WebrtcProvider(
      `study-session-${sessionId}`,
      ydoc,
      { signaling: ['wss://signaling.yjs.dev'] }
    );

    const ytext = ydoc.getText('shared-notes');
    
    ytext.observe(event => {
      setContent(ytext.toString());
    });

    setDoc(ydoc);
    setProvider(yprovider);

    return () => {
      yprovider.destroy();
      ydoc.destroy();
    };
  }, [sessionId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (doc) {
      const ytext = doc.getText('shared-notes');
      ytext.delete(0, ytext.length);
      ytext.insert(0, newContent);
    }
  };

  const saveNotes = async () => {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sessionId }),
      });
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Shared Notes</h3>
        <Button onClick={saveNotes}>
          <Save className="mr-2 h-4 w-4" />
          Save Notes
        </Button>
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-[200px] p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Take notes collaboratively..."
      />

      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Connected</span>
        </div>
        {provider?.awareness.getStates().size > 1 && (
          <span>• {provider.awareness.getStates().size} participants</span>
        )}
      </div>
    </Card>
  );
}