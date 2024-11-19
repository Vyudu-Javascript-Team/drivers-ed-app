'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoadSign } from './road-sign';
import { useToast } from '@/hooks/use-toast';

interface SignQuizProps {
  sign: {
    name: string;
    imageUrl: string;
    description: string;
    quiz: {
      question: string;
      options: string[];
      correctAnswer: number;
    };
  };
  onComplete: (success: boolean) => void;
}

export function SignQuiz({ sign, onComplete }: SignQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);

    const isCorrect = index === sign.quiz.correctAnswer;
    onComplete(isCorrect);

    if (isCorrect) {
      toast.success('Correct! Well done!');
    } else {
      toast.error('Incorrect. Try again!');
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-center">
          <RoadSign
            imageUrl={sign.imageUrl}
            width={200}
            height={200}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">{sign.name}</h3>
          <p className="text-muted-foreground">{sign.description}</p>
        </div>

        <div className="space-y-4">
          <p className="font-medium">{sign.quiz.question}</p>
          <div className="grid gap-2">
            {sign.quiz.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showFeedback
                    ? index === sign.quiz.correctAnswer
                      ? 'default'
                      : index === selectedAnswer
                      ? 'destructive'
                      : 'outline'
                    : 'outline'
                }
                className="justify-start h-auto p-4"
                onClick={() => !showFeedback && handleAnswer(index)}
                disabled={showFeedback}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <Button
            className="w-full"
            onClick={() => {
              setSelectedAnswer(null);
              setShowFeedback(false);
            }}
          >
            Next Sign
          </Button>
        )}
      </div>
    </Card>
  );
}