'use client'

import { Card } from "@/components/ui/card"
import { Users, BookOpen, ClipboardList, DollarSign } from "lucide-react"

const stats = [
  {
    name: "Total Users",
    value: "2,543",
    icon: Users,
    change: "+12.3%",
  },
  {
    name: "Active Stories",
    value: "35",
    icon: BookOpen,
    change: "+8.1%",
  },
  {
    name: "Test Completions",
    value: "12,453",
    icon: ClipboardList,
    change: "+15.2%",
  },
  {
    name: "Revenue",
    value: "$17,801",
    icon: DollarSign,
    change: "+10.5%",
  },
]

export function UserStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex items-center gap-4">
            <stat.icon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-xs text-green-500">{stat.change} from last month</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}