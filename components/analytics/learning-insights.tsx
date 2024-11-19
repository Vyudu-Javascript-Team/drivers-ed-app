"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface LearningInsightsProps {
  userId: string;
}

export function LearningInsights({ userId }: LearningInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [userId]);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/analytics/insights/${userId}`);
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights) {
    return <div>Loading insights...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Learning Insights</h2>
          <Brain className="h-6 w-6 text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Success Probability</p>
                <p className="text-2xl font-bold">
                  {(insights.predictions.successProbability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          {insights.patterns.weakAreas.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Areas to Focus</p>
                  <p className="text-sm">
                    {insights.patterns.weakAreas.join(", ")}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Learning Progress</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.patterns.progressHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <div className="space-y-2">
            {insights.recommendations.map((rec: any, index: number) => (
              <Card key={index} className="p-4">
                <p className="font-medium">{rec.title}</p>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}