import { notFound } from "next/navigation"
import { StoryContent } from "@/components/stories/story-content"
import { StoryProgress } from "@/components/stories/story-progress"
import { prisma } from "@/lib/prisma"

export default async function StoryPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
  })

  if (!story) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <StoryProgress storyId={params.id} />
        <StoryContent story={story} />
      </div>
    </div>
  )
}