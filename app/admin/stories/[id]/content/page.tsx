import { useState } from "react"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { QuestionForm } from "@/components/question-bank/question-form"
import { MediaLibrary } from "@/components/editor/media-library"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContentManager } from "@/hooks/use-content-manager"
import { toast } from "sonner"

export default function StoryContentPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState("")
  const contentManager = useContentManager(params.id)

  const handleContentSave = async () => {
    try {
      await contentManager.saveContent(content)
      toast.success("Content saved successfully")
    } catch (error) {
      toast.error("Failed to save content")
    }
  }

  const handleMediaSelect = (url: string) => {
    // Insert media into editor
    setContent((prev) => `${prev}\n![](${url})`)
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
      toast.error("Failed to add question")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Story Content</h1>
        <Button onClick={handleContentSave} disabled={contentManager.isSaving}>
          {contentManager.isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Content Editor</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <Card className="p-6">
            <TiptapEditor content={content} onChange={setContent} />
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-4">
          <Card className="p-6">
            <QuestionForm onSubmit={handleQuestionSubmit} />
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card className="p-6">
            <MediaLibrary onSelect={handleMediaSelect} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}