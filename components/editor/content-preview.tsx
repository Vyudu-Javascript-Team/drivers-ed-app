"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface ContentPreviewProps {
  content: any
  onPublish?: () => void
}

export function ContentPreview({ content, onPublish }: ContentPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)

  const renderSection = (section: any) => {
    switch (section.type) {
      case "text":
        return <p className="mb-4">{section.content}</p>
      case "rule":
        return (
          <div className="mb-4 p-4 bg-secondary rounded-lg">
            <h3 className="font-bold mb-2">{section.title}</h3>
            <p>{section.content}</p>
          </div>
        )
      case "question":
        return (
          <div className="mb-4 p-4 border rounded-lg">
            <p className="font-medium mb-2">{section.text}</p>
            <ul className="space-y-2">
              {section.options.map((option: string, index: number) => (
                <li
                  key={index}
                  className={`p-2 rounded-lg ${
                    index === section.correctAnswer
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-secondary"
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
            {section.explanation && (
              <p className="mt-4 text-sm text-muted-foreground">
                {section.explanation}
              </p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Show Preview
            </>
          )}
        </Button>
        {onPublish && (
          <Button onClick={onPublish}>Publish</Button>
        )}
      </div>

      {showPreview && (
        <div className="prose dark:prose-invert max-w-none">
          {content.sections?.map((section: any, index: number) => (
            <div key={index}>{renderSection(section)}</div>
          ))}
        </div>
      )}
    </Card>
  )
}