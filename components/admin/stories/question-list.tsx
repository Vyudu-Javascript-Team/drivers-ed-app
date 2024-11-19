"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { toast } from "sonner"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuestionListProps {
  storyId: string
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

export function QuestionList({
  storyId,
  questions,
  onEdit,
  onDelete,
}: QuestionListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      await fetch(`/api/admin/stories/${storyId}/questions/${id}`, {
        method: "DELETE",
      })
      onDelete(id)
      toast.success("Question deleted successfully")
    } catch (error) {
      console.error("Failed to delete question:", error)
      toast.error("Failed to delete question")
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Options</TableHead>
          <TableHead>Correct Answer</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell>{question.text}</TableCell>
            <TableCell>
              <ul className="list-disc list-inside">
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </TableCell>
            <TableCell>Option {question.correctAnswer + 1}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(question)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(question.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}