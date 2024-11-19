"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { QuestionForm } from "@/components/question-bank/question-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ContentVersion } from "@/components/editor/content-version"
import { MediaLibrary } from "@/components/editor/media-library"
import { useContentManager } from "@/hooks/use-content-manager"

export default function EditStoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [story, setStory] = useState<any>(null)
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const contentManager = useContentManager(params.id)

  useEffect(() => {
    fetchStory()
    fetchVersions()
  }, [params.id])

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${params.id}`)
      const data = await response.json()
      setStory(data)
    } catch (error) {
      console.error("Failed to fetch story:", error)
      toast.error("Failed to fetch story")
    } finally {
      setLoading(false)
    }
  }

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/admin/stories/${params.id}/versions`)
      const data = await response.json()
      setVersions(data)
    } catch (error) {
      console.error("Failed to fetch versions:", error)
    }
  }

  const handleContentUpdate = async (content: string) => {
    await contentManager.saveContent(content)
    fetchVersions()
  }

  const handleVersionRestore = async (version: any) => {
    try {
      await handleContentUpdate(version.content)
      setStory({ ...story, content: version.content })
      toast.success("Version restored successfully")
    } catch (error) {
      console.error("Failed to restore version:", error)
      toast.error("Failed to restore version")
    }
  }

  const handleQuestionSubmit = async (data: any) => {
    try {
      await fetch(`/api/admin/stories/${params.id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      toast.success("Question added successfully")
    } catch (error) {
      console.error("Failed to add question:", error)
      toast.error("Failed to add question")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{story.title}</h1>
        <Button onClick={() => router.push("/admin/stories")}>Back to Stories</Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card className="p-6">
            <TiptapEditor
              content={story.content}
              onChange={handleContentUpdate}
            />
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <Card className="p-6">
            <QuestionForm onSubmit={handleQuestionSubmit} />
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card className="p-6">
            <MediaLibrary onSelect={(url) => {
              // Insert media into editor
            }} />
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <ContentVersion
            versions={versions}
            onRestore={handleVersionRestore}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}