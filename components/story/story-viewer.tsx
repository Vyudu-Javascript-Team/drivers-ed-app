import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface StoryViewerProps {
  story: {
    id: string;
    title: string;
    content: {
      type: 'text' | 'image' | 'question';
      content: string;
      options?: string[];
      correctAnswer?: string;
    }[];
  };
  onComplete: (score: number) => void;
}

export function StoryViewer({ story, onComplete }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);

  const currentSlide = story.content[currentIndex];
  const progress = ((currentIndex + 1) / story.content.length) * 100;

  const handleNext = () => {
    if (currentIndex < story.content.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(score);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    if (currentSlide.correctAnswer === answer) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{story.title}</h2>
        <Progress value={progress} className="w-48" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 min-h-[400px] flex flex-col justify-between">
            {currentSlide.type === 'text' && (
              <div className="prose max-w-none">
                {currentSlide.content}
              </div>
            )}

            {currentSlide.type === 'image' && (
              <div className="relative h-80 w-full">
                <Image
                  src={currentSlide.content}
                  alt="Story illustration"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            {currentSlide.type === 'question' && (
              <div className="space-y-4">
                <p className="text-lg font-medium">{currentSlide.content}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSlide.options?.map((option) => (
                    <Button
                      key={option}
                      variant={answers[currentIndex] === option ? "default" : "outline"}
                      onClick={() => handleAnswer(option)}
                      className="w-full justify-start"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  currentSlide.type === 'question' && !answers[currentIndex]
                }
              >
                {currentIndex === story.content.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
