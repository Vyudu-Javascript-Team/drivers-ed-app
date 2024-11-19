'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AchievementCard } from "./achievement-card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  xpReward: number;
  progress?: number;
  maxProgress?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
}

export function AchievementShowcase({ achievements }: AchievementShowcaseProps) {
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState<string>('ALL');
  const [sort, setSort] = useState<'recent' | 'xp' | 'rarity'>('recent');

  const filteredAchievements = achievements
    .filter(achievement => 
      achievement.title.toLowerCase().includes(search.toLowerCase()) &&
      (rarity === 'ALL' || achievement.rarity === rarity)
    )
    .sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime();
      }
      if (sort === 'xp') {
        return b.xpReward - a.xpReward;
      }
      // Sort by rarity
      const rarityOrder = { LEGENDARY: 4, EPIC: 3, RARE: 2, COMMON: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalXP = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Achievements</h3>
          <p className="text-3xl font-bold">
            {unlockedCount} / {achievements.length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Completion</h3>
          <p className="text-3xl font-bold">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total XP Earned</h3>
          <p className="text-3xl font-bold">{totalXP}</p>
        </Card>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search achievements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={rarity} onValueChange={setRarity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Rarities</SelectItem>
            <SelectItem value="COMMON">Common</SelectItem>
            <SelectItem value="RARE">Rare</SelectItem>
            <SelectItem value="EPIC">Epic</SelectItem>
            <SelectItem value="LEGENDARY">Legendary</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(value: 'recent' | 'xp' | 'rarity') => setSort(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="xp">XP Reward</SelectItem>
            <SelectItem value="rarity">Rarity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} {...achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements
              .filter(a => a.isUnlocked)
              .map((achievement) => (
                <AchievementCard key={achievement.id} {...achievement} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAchievements
              .filter(a => !a.isUnlocked)
              .map((achievement) => (
                <AchievementCard key={achievement.id} {...achievement} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}