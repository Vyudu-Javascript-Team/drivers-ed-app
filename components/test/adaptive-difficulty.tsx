'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DifficultySettings {
  difficulty: string;
  adaptiveMode: boolean;
  category: string;
}

export function AdaptiveDifficulty() {
  const [settings, setSettings] = useState<DifficultySettings>({
    difficulty: 'MEDIUM',
    adaptiveMode: true,
    category: 'GENERAL',
  });

  const [performance, setPerformance] = useState({
    recentScores: [] as number[],
    averageScore: 0,
    trend: 'stable' as 'improving' | 'declining' | 'stable',
  });

  useEffect(() => {
    fetchSettings();
    fetchPerformance();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/test-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/api/user/test-performance');
      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error('Failed to fetch performance:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<DifficultySettings>) => {
    try {
      await fetch('/api/user/test-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, ...newSettings }),
      });
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Difficulty Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="adaptive-mode">Adaptive Mode</Label>
              <Switch
                id="adaptive-mode"
                checked={settings.adaptiveMode}
                onCheckedChange={(checked) =>
                  updateSettings({ adaptiveMode: checked })
                }
              />
            </div>

            {!settings.adaptiveMode && (
              <div className="space-y-2">
                <Label>Fixed Difficulty</Label>
                <Select
                  value={settings.difficulty}
                  onValueChange={(value) =>
                    updateSettings({ difficulty: value })
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
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Performance Overview</h3>
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

            {settings.adaptiveMode && (
              <p className="text-sm text-muted-foreground">
                Based on your recent performance, difficulty is{' '}
                {performance.trend === 'improving'
                  ? 'gradually increasing'
                  : performance.trend === 'declining'
                  ? 'being adjusted to help you improve'
                  : 'staying stable'}
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}