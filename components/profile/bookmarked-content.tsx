import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Clock, ArrowRight } from "lucide-react";

interface BookmarkedContentProps {
  userId: string;
}

interface BookmarkedItem {
  id: string;
  type: "story" | "practice" | "test";
  title: string;
  description: string;
  topic: string;
  bookmarkedAt: string;
  lastVisited?: string;
  progress?: number;
}

export function BookmarkedContent({ userId }: BookmarkedContentProps) {
  const { data: bookmarks, isLoading } = useQuery<BookmarkedItem[]>({
    queryKey: ["bookmarkedContent", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/bookmarks`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading bookmarks...</div>;
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <Bookmark className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No bookmarks</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start bookmarking content to save it for later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.topic}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>
                  Bookmarked {new Date(item.bookmarkedAt).toLocaleDateString()}
                </span>
              </div>
              
              {item.lastVisited && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    Last visited {new Date(item.lastVisited).toLocaleDateString()}
                  </span>
                </div>
              )}

              {item.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <Link
                href={`/${item.type}s/${item.id}`}
                className="w-full"
              >
                <Button className="w-full">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
