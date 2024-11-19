'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    revenue: 400,
    date: "Jan 1",
  },
  {
    revenue: 700,
    date: "Jan 2",
  },
  {
    revenue: 900,
    date: "Jan 3",
  },
  {
    revenue: 1100,
    date: "Jan 4",
  },
  {
    revenue: 800,
    date: "Jan 5",
  },
  {
    revenue: 1500,
    date: "Jan 6",
  },
  {
    revenue: 2100,
    date: "Jan 7",
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}