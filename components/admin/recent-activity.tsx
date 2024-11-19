'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "John Doe",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      email: "j.doe@example.com",
    },
    activity: "completed story",
    target: "Atlanta Traffic Tales",
    time: "2 minutes ago",
  },
  {
    user: {
      name: "Sarah Smith",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      email: "s.smith@example.com",
    },
    activity: "passed test",
    target: "Georgia Road Signs",
    time: "5 minutes ago",
  },
  {
    user: {
      name: "Mike Johnson",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      email: "m.johnson@example.com",
    },
    activity: "subscribed",
    target: "Annual Plan",
    time: "10 minutes ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.image} />
            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>
              {' '}
              {activity.activity}
              {' '}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}