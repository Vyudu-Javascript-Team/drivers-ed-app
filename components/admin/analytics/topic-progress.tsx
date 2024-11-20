import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const data = [
  {
    topic: "Traffic Signs and Signals",
    completion: 92,
    avgScore: 88,
    timeSpent: "45m",
    trend: "up",
  },
  {
    topic: "Right of Way Rules",
    completion: 85,
    avgScore: 82,
    timeSpent: "38m",
    trend: "up",
  },
  {
    topic: "Parking Regulations",
    completion: 78,
    avgScore: 75,
    timeSpent: "30m",
    trend: "down",
  },
  {
    topic: "Speed Limits",
    completion: 88,
    avgScore: 85,
    timeSpent: "35m",
    trend: "up",
  },
  {
    topic: "Emergency Procedures",
    completion: 72,
    avgScore: 70,
    timeSpent: "28m",
    trend: "down",
  },
  {
    topic: "Vehicle Safety",
    completion: 82,
    avgScore: 79,
    timeSpent: "32m",
    trend: "up",
  },
]

export function TopicProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Topic</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Avg. Score</TableHead>
              <TableHead>Time Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.topic}>
                <TableCell className="font-medium">{item.topic}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={item.completion} className="w-[60px]" />
                    <span className="text-sm">{item.completion}%</span>
                  </div>
                </TableCell>
                <TableCell>{item.avgScore}%</TableCell>
                <TableCell>{item.timeSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
