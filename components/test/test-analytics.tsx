'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Analytics {
  totalTests: number
  averageScore: number
  bestScore: number
  recentScores: Array<{
    score: number
    test: {
      title: string
      state: string
    }
    createdAt: string
  }>
  scoreDistribution: {
    '0-20': number
    '21-40': number
    '41-60': number
    '61-80': number
    '81-100': number
  }
}

export function TestAnalytics({ state }: { state?: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [state])

  const fetchAnalytics = async () => {
    try {
      const url = state
        ? `/api/tests/analytics?state=${state}`
        : '/api/tests/analytics'
      const response = await fetch(url)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return <div>Loading analytics...</div>
  }

  const distributionData = Object.entries(analytics.scoreDistribution).map(
    ([range, count]) => ({
      range,
      count,
    })
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Tests</h3>
          <p className="text-3xl font-bold">{analytics.totalTests}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <p className="text-3xl font-bold">
            {analytics.averageScore.toFixed(1)}%
          </p>
          <Progress
            value={analytics.averageScore}
            className="mt-2"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Best Score</h3>
          <p className="text-3xl font-bold">{analytics.bestScore}%</p>
          <Progress
            value={analytics.bestScore}
            className="mt-2"
          />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Tests</h3>
        <div className="space-y-4">
          {analytics.recentScores.map((result, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{result.test.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{result.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}