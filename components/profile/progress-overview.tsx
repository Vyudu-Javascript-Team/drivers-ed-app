import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressOverviewProps {
  userId: string;
  detailed?: boolean;
}

interface ProgressData {
  overallProgress: number;
  topicsCompleted: number;
  totalTopics: number;
  testsPassed: number;
  totalTests: number;
  recentAchievements: {
    id: string;
    name: string;
    earnedAt: string;
  }[];
  topicProgress: {
    topicId: string;
    name: string;
    progress: number;
    status: "not-started" | "in-progress" | "completed";
  }[];
}

export function ProgressOverview({ userId, detailed = false }: ProgressOverviewProps) {
  const { data: progress, isLoading } = useQuery<ProgressData>({
    queryKey: ["userProgress", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/progress`);
      if (!response.ok) {
        throw new Error("Failed to fetch progress");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  if (!progress) {
    return <div>No progress data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              {progress.topicsCompleted} of {progress.totalTopics} topics completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress.overallProgress} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">
              {Math.round(progress.overallProgress)}% Complete
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Topics Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.topicsCompleted}</div>
              <p className="text-xs text-gray-500">out of {progress.totalTopics}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.testsPassed}</div>
              <p className="text-xs text-gray-500">out of {progress.totalTests}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {detailed && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress.recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{achievement.name}</Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(achievement.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Topic Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress.topicProgress.map((topic) => (
                  <div key={topic.topicId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <Badge
                        variant={
                          topic.status === "completed"
                            ? "success"
                            : topic.status === "in-progress"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {topic.status}
                      </Badge>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                    <p className="text-sm text-gray-500">
                      {Math.round(topic.progress)}% Complete
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
