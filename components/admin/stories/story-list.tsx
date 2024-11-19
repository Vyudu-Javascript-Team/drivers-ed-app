"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Story {
  id: string
  title: string
  state: string
  published: boolean
  updatedAt: string
}

export function StoryList() {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    try {
      await fetch(`/api/admin/stories/${id}`, {
        method: "DELETE",
      })
      setStories(stories.filter((story) => story.id !== id))
    } catch (error) {
      console.error("Failed to delete story:", error)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.state}</TableCell>
              <TableCell>
                <Badge variant={story.published ? "default" : "secondary"}>
                  {story.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/admin/stories/${story.id}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(story.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}