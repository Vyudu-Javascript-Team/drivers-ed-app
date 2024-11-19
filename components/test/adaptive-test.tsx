'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ImageBasedQuestion } from './question-types/image-based-question';
import { OrderingQuestion } from './question-types/ordering-question';
import useConfetti from '@/hooks/use-confetti';

export function AdaptiveTest({ testId }: { testId: string }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    fetchQuestions();
  }, [testId, difficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/questions?difficulty=${difficulty}`);
      const data = await response.json();
      setQuestions(data.questions);
      setTimeRemaining(data.timeLimit * 60);
    } catch (error) {
      toast.error('Failed to load questions');
    }
  };

  const handleAnswer = async (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      await submitTest(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const submitTest = async (finalAnswers: any[]) => {
    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: finalAnswers,
          timeSpent: timeRemaining,
          difficulty
        }),
      });

      const result = await response.json();

      if (result.score >= 90) {
        triggerConfetti();
      }

      // Update difficulty based on performance
      setDifficulty(result.newDifficulty);

      toast.success(`Test completed! Score: ${result.score}%`);
    } catch (error) {
      toast.error('Failed to submit test');
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'IMAGE_BASED':
        return (
          <ImageBasedQuestion
            question={question}
            onAnswer={handleAnswer}
          />
        );
      case 'ORDERING':
        return (
          <OrderingQuestion
            question={question}
            onAnswer={handleAnswer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Adaptive Test</h2>
            <p className="text-sm text-muted-foreground">
              Difficulty: {difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>

        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="mb-6"
        />

        {questions[currentQuestion] && renderQuestion(questions[currentQuestion])}
      </Card>
    </div>
  );
}