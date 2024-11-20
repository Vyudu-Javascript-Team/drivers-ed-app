import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    category: "Rules",
    "Pass Rate": 85,
    "Avg Score": 78,
  },
  {
    category: "Signs",
    "Pass Rate": 92,
    "Avg Score": 84,
  },
  {
    category: "Safety",
    "Pass Rate": 88,
    "Avg Score": 80,
  },
  {
    category: "Parking",
    "Pass Rate": 76,
    "Avg Score": 72,
  },
  {
    category: "Emergency",
    "Pass Rate": 82,
    "Avg Score": 75,
  },
  {
    category: "Laws",
    "Pass Rate": 79,
    "Avg Score": 73,
  },
]

export function TestPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Performance by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="category"
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
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Bar
                dataKey="Pass Rate"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Avg Score"
                fill="#82ca9d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-8 pt-4">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#8884d8]" />
            <span className="text-sm text-muted-foreground">Pass Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-[#82ca9d]" />
            <span className="text-sm text-muted-foreground">Average Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
