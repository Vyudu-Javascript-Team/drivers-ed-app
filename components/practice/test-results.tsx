import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionView } from "./question-view";
import { Check, X, Clock, Trophy, ArrowRight } from "lucide-react";

interface TestResultsProps {
  testId: string;
  submission: {
    id: string;
    score: number;
    timeSpent: number;
    answers: Record<string, number>;
    correctAnswers: Record<string, number>;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      explanation: string;
      imageUrl?: string;
    }>;
  };
}

export function TestResults({ testId, submission }: TestResultsProps) {
  const totalQuestions = submission.questions.length;
  const correctAnswers = Object.keys(submission.answers).filter(
    (qId) => submission.answers[qId] === submission.correctAnswers[qId]
  ).length;
  const minutes = Math.floor(submission.timeSpent / 60);
  const seconds = submission.timeSpent % 60;
  const isPassed = submission.score >= 70;

  return (
    <div className="space-y-8">
      {/* Results Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Test Results</CardTitle>
          <CardDescription>
            Here's how you performed on the test
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {Math.round(submission.score)}%
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Status</span>
              </div>
              <Badge
                variant={isPassed ? "success" : "destructive"}
                className="mt-2"
              >
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Correct</span>
              </div>
              <div className="mt-2">
                {correctAnswers} of {totalQuestions}
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Time</span>
              </div>
              <div className="mt-2">
                {minutes}:{String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Answer Review</h3>
        {submission.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {index + 1}</CardTitle>
                {submission.answers[question.id] ===
                submission.correctAnswers[question.id] ? (
                  <Badge variant="success" className="flex items-center">
                    <Check className="mr-1 h-4 w-4" />
                    Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center">
                    <X className="mr-1 h-4 w-4" />
                    Incorrect
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <QuestionView
                question={question}
                selectedAnswer={submission.answers[question.id]}
                onAnswer={() => {}}
              />
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-700">
                  Correct Answer: {question.options[submission.correctAnswers[question.id]]}
                </p>
                <p className="mt-2 text-sm text-green-600">{question.explanation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/practice">Back to Practice</Link>
        </Button>
        <Button asChild>
          <Link href={`/practice/test/${testId}`}>
            Retake Test
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
