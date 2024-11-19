'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageBasedQuestionProps {
  question: {
    text: string;
    imageUrl: string;
    options: string[];
    explanation?: string;
  };
  onAnswer: (answer: number) => void;
  showFeedback?: boolean;
  correctAnswer?: number;
  userAnswer?: number;
}

export function ImageBasedQuestion({
  question,
  onAnswer,
  showFeedback,
  correctAnswer,
  userAnswer,
}: ImageBasedQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    onAnswer(index);
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return selectedOption === index ? 'border-primary' : '';
    }
    if (index === correctAnswer) {
      return 'border-green-500 bg-green-50 dark:bg-green-900';
    }
    if (index === userAnswer && index !== correctAnswer) {
      return 'border-red-500 bg-red-50 dark:bg-red-900';
    }
    return '';
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <p className="text-lg font-medium">{question.text}</p>
        
        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
          <Image
            src={question.imageUrl}
            alt="Question image"
            fill
            className="object-cover"
          />
        </div>

        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                'justify-start h-auto p-4 text-left',
                getOptionStyle(index)
              )}
              onClick={() => handleSelect(index)}
              disabled={showFeedback}
            >
              {option}
            </Button>
          ))}
        </div>

        {showFeedback && question.explanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </div>
    </Card>
  );
}