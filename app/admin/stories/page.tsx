import { Metadata } from "next"
import { StoryList } from "@/components/admin/stories/story-list"
import { CreateStoryButton } from "@/components/admin/stories/create-story-button"

export const metadata: Metadata = {
  title: "Stories Management",
  description: "Manage driver's education stories",
}

export default function StoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stories</h1>
        <CreateStoryButton />
      </div>
      <StoryList />
    </div>
  )
}