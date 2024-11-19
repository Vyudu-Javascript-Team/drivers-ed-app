import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/hooks/use-gamification";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
}

export function AdaptiveTest({ testId }: { testId: string }) {
  const router = useRouter();
  const { addXP } = useGamification();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/tests/${testId}/questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load test questions");
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [testId]);

  const handleAnswer = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const correct = optionIndex === questions[currentQuestion].correctAnswer;
    if (correct) {
      setScore(score + 1);
      await addXP(10); // Award XP for correct answers
      toast.success("Correct! +10 XP");
    }

    // Adaptive difficulty adjustment
    if (correct && score > (currentQuestion * 0.8)) {
      setUserLevel(Math.min(userLevel + 1, 5));
    } else if (!correct && score < (currentQuestion * 0.6)) {
      setUserLevel(Math.max(userLevel - 1, 1));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    const finalScore = Math.round((score / questions.length) * 100);
    try {
      await fetch('/api/tests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, score: finalScore }),
      });
      
      if (finalScore >= 80) {
        await addXP(50); // Bonus XP for passing
        toast.success("Congratulations! You passed the test! +50 XP");
      }
      
      router.push(`/test-results/${testId}?score=${finalScore}`);
    } catch (error) {
      toast.error("Failed to save test results");
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No questions available for this test.</p>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Score: {score}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQ.text}</h3>
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  answered
                    ? index === currentQ.correctAnswer
                      ? "success"
                      : index === selectedAnswer
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className="justify-start h-auto py-3 px-4"
                onClick={() => !answered && handleAnswer(index)}
                disabled={answered}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {answered && (
          <div className="space-y-4">
            <p className={`text-sm ${
              selectedAnswer === currentQ.correctAnswer
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {currentQ.explanation}
            </p>
            <Button onClick={nextQuestion}>
              {currentQuestion === questions.length - 1 ? "Finish Test" : "Next Question"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}