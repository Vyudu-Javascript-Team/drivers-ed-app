import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, BookOpen } from "lucide-react"

const recentContent = [
  {
    type: "test",
    title: "Road Signs Practice Test",
    author: "John Doe",
    date: "2 hours ago",
    authorImage: "/avatars/01.png",
  },
  {
    type: "story",
    title: "Safe Night Driving Guide",
    author: "Jane Smith",
    date: "5 hours ago",
    authorImage: "/avatars/02.png",
  },
  {
    type: "test",
    title: "Traffic Rules Assessment",
    author: "Mike Johnson",
    date: "1 day ago",
    authorImage: "/avatars/03.png",
  },
  {
    type: "story",
    title: "Emergency Response Tips",
    author: "Sarah Wilson",
    date: "2 days ago",
    authorImage: "/avatars/04.png",
  },
]

export function RecentContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentContent.map((item, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={item.authorImage} alt="Avatar" />
                <AvatarFallback>{item.author[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  by {item.author}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {item.type === "test" ? (
                  <FileQuestion className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="ml-2 text-sm text-muted-foreground">{item.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
