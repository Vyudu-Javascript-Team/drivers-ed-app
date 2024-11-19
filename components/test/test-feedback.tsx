'use client'

import { Card } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface TestFeedbackProps {
  questions: Array<{
    text: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
  userAnswers: number[]
}

export function TestFeedback({ questions, userAnswers }: TestFeedbackProps) {
  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 rounded-full p-2 ${
                userAnswers[index] === question.correctAnswer
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {userAnswers[index] === question.correctAnswer ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-medium mb-2">{question.text}</h3>

              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg ${
                      optionIndex === question.correctAnswer
                        ? 'bg-green-100'
                        : optionIndex === userAnswers[index]
                        ? 'bg-red-100'
                        : 'bg-gray-50'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}