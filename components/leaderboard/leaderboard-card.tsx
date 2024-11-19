'use client'

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Medal } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  user: {
    name: string
    image?: string
    state: string
  }
  score: number
  isCurrentUser?: boolean
}

export function LeaderboardCard({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">Top Drivers</h3>
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
              entry.isCurrentUser ? 'bg-primary/10' : 'hover:bg-secondary'
            }`}
          >
            <div className="w-8 text-center font-bold">
              {entry.rank <= 3 ? (
                <Medal className={`h-6 w-6 ${
                  entry.rank === 1 ? 'text-yellow-500' :
                  entry.rank === 2 ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              ) : (
                entry.rank
              )}
            </div>
            
            <Avatar>
              <AvatarImage src={entry.user.image} />
              <AvatarFallback>{entry.user.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="font-medium">{entry.user.name}</p>
              <p className="text-sm text-muted-foreground">{entry.user.state}</p>
            </div>
            
            <div className="text-right">
              <p className="font-bold">{entry.score}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}