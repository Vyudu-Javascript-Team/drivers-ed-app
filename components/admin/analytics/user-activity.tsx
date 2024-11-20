import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    date: "Jan 1",
    "Active Users": 220,
    "New Users": 35,
  },
  {
    date: "Jan 2",
    "Active Users": 280,
    "New Users": 45,
  },
  {
    date: "Jan 3",
    "Active Users": 250,
    "New Users": 30,
  },
  {
    date: "Jan 4",
    "Active Users": 310,
    "New Users": 52,
  },
  {
    date: "Jan 5",
    "Active Users": 290,
    "New Users": 40,
  },
  {
    date: "Jan 6",
    "Active Users": 350,
    "New Users": 55,
  },
  {
    date: "Jan 7",
    "Active Users": 320,
    "New Users": 48,
  },
]

export function UserActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Active Users"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="New Users"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-8 pt-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#8884d8]" />
            <span className="text-sm text-muted-foreground">Active Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#82ca9d]" />
            <span className="text-sm text-muted-foreground">New Users</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
