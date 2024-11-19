import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// This would typically come from your database
const stories = {
  'atlanta-traffic': {
    title: 'Atlanta Traffic Tales with OutKast',
    content: [
      {
        type: 'text',
        content: 'Big Boi and André 3000 are stuck in Atlanta traffic...',
      },
      {
        type: 'rule',
        title: 'Right of Way Rule',
        content: 'When two vehicles arrive at an intersection simultaneously...',
      },
      {
        type: 'question',
        text: 'Who has the right of way when two vehicles arrive at an intersection simultaneously?',
        options: [
          'The vehicle on the right',
          'The vehicle on the left',
          'The larger vehicle',
          'The faster vehicle',
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Add more stories here
}

export default function StoryPage({
  params,
}: {
  params: { state: string; storyId: string }
}) {
  const story = stories[params.storyId as keyof typeof stories]

  if (!story) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{story.title}</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {story.content.map((section, index) => {
          if (section.type === 'text') {
            return (
              <Card key={index} className="p-6">
                <p className="text-lg leading-relaxed">{section.content}</p>
              </Card>
            )
          }

          if (section.type === 'rule') {
            return (
              <Card key={index} className="p-6 border-primary">
                <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                <p className="text-lg leading-relaxed">{section.content}</p>
              </Card>
            )
          }

          if (section.type === 'question') {
            return (
              <Card key={index} className="p-6 bg-secondary">
                <h3 className="text-xl font-bold mb-4">{section.text}</h3>
                <div className="space-y-2">
                  {section.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </Card>
            )
          }
        })}

        <div className="flex justify-between pt-8">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Section
          </Button>
          <Button>
            Next Section
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}