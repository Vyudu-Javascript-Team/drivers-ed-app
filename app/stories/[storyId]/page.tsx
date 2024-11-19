import { notFound } from "next/navigation"
import { StoryContent } from "@/components/stories/story-content"
import { StoryProgress } from "@/components/stories/story-progress"

export default async function StoryPage({ 
  params 
}: { 
  params: { storyId: string } 
}) {
  const story = await prisma.story.findUnique({
    where: { id: params.storyId },
    include: {
      content: true,
    },
  })

  if (!story) {
    notFound()
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <StoryProgress storyId={params.storyId} />
        <StoryContent story={story} />
      </div>
    </div>
  )
}