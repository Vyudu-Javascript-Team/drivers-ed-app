import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudyHistoryProps {
  userId: string;
  limit?: number;
}

interface StudySession {
  id: string;
  type: "practice" | "test" | "study";
  topic: string;
  score?: number;
  duration: number;
  completedAt: string;
  status: "passed" | "failed" | "completed";
}

export function StudyHistory({ userId, limit }: StudyHistoryProps) {
  const { data: sessions, isLoading } = useQuery<StudySession[]>({
    queryKey: ["studyHistory", userId, limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/user/${userId}/study-history${limit ? `?limit=${limit}` : ""}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch study history");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading study history...</div>;
  }

  if (!sessions || sessions.length === 0) {
    return <div>No study history available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>
              {new Date(session.completedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="capitalize">{session.type}</TableCell>
            <TableCell>{session.topic}</TableCell>
            <TableCell>
              {Math.round(session.duration / 60)} min
            </TableCell>
            <TableCell>
              {session.score !== undefined ? `${session.score}%` : "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  session.status === "passed"
                    ? "success"
                    : session.status === "failed"
                    ? "destructive"
                    : "secondary"
                }
              >
                {session.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
