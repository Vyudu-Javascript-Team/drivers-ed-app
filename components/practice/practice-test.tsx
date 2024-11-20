import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface PracticeTestProps {
  questions: Question[];
  onComplete: (score: number, timeSpent: number) => void;
}

export function PracticeTest({ questions, onComplete }: PracticeTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const selectedAnswer = answers[currentQuestion.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleAnswer = (answer: string) => {
    if (answers[currentQuestion.id]) return; // Prevent changing answer
    
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete(score, timeSpent);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Timer className="mr-1 h-4 w-4" />
            {Math.floor((Date.now() - startTime) / 1000)}s
          </Badge>
        </div>
        <Progress value={progress} className="w-48" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                let variant: "outline" | "default" | "destructive" = "outline";
                
                if (showExplanation) {
                  if (isCorrectAnswer) variant = "default";
                  if (isSelected && !isCorrectAnswer) variant = "destructive";
                } else if (isSelected) {
                  variant = "default";
                }

                return (
                  <Button
                    key={option}
                    variant={variant}
                    onClick={() => handleAnswer(option)}
                    disabled={showExplanation}
                    className={cn(
                      "w-full justify-start h-auto py-4 px-6",
                      isSelected && "ring-2 ring-primary"
                    )}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6"
                >
                  <div className={cn(
                    "p-4 rounded-lg",
                    isCorrect ? "bg-green-50" : "bg-red-50"
                  )}>
                    {isCorrect ? (
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Correct!</p>
                          <p className="text-green-700 mt-1">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800">Incorrect</p>
                          <p className="text-red-700 mt-1">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedAnswer}
          size="lg"
        >
          {isLastQuestion ? 'Complete Test' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
