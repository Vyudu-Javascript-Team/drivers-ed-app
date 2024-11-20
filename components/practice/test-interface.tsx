import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/practice/timer";
import { QuestionView } from "@/components/practice/question-view";
import { QuestionNav } from "@/components/practice/question-nav";
import { useToast } from "@/components/ui/use-toast";

interface TestInterfaceProps {
  testId: string;
  userId: string;
  initialTest: {
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      explanation?: string;
      imageUrl?: string;
    }>;
  };
}

export function TestInterface({
  testId,
  userId,
  initialTest,
}: TestInterfaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTest.timeLimit * 60);

  const progress = (Object.keys(answers).length / initialTest.questions.length) * 100;

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/practice/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId,
          userId,
          answers,
          timeSpent: initialTest.timeLimit * 60 - timeRemaining,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit test");
      }

      const result = await response.json();
      router.push(`/practice/test/${testId}/results?submissionId=${result.submissionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < initialTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQuestionData = initialTest.questions[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Header with progress and timer */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-1/2">
          <p className="text-sm text-muted-foreground mb-2">Progress</p>
          <Progress value={progress} className="h-2" />
        </div>
        <Timer
          initialTime={initialTest.timeLimit * 60}
          onTimeUp={handleTimeUp}
          onTick={setTimeRemaining}
        />
      </div>

      {/* Main question card */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {initialTest.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionView
            question={currentQuestionData}
            selectedAnswer={answers[currentQuestionData.id]}
            onAnswer={(answer) => handleAnswer(currentQuestionData.id, answer)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <QuestionNav
            total={initialTest.questions.length}
            current={currentQuestion}
            answers={answers}
            onChange={setCurrentQuestion}
          />
          <Button
            onClick={
              currentQuestion === initialTest.questions.length - 1
                ? handleSubmit
                : handleNext
            }
            disabled={isSubmitting}
          >
            {currentQuestion === initialTest.questions.length - 1
              ? isSubmitting
                ? "Submitting..."
                : "Submit Test"
              : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
