import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuestionViewProps {
  question: {
    id: string;
    question: string;
    options: string[];
    explanation?: string;
    imageUrl?: string;
  };
  selectedAnswer?: number;
  onAnswer: (index: number) => void;
}

export function QuestionView({
  question,
  selectedAnswer,
  onAnswer,
}: QuestionViewProps) {
  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div className="text-lg font-medium">{question.question}</div>

      {/* Question Image (if any) */}
      {question.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            src={question.imageUrl}
            alt="Question illustration"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Answer Options */}
      <RadioGroup
        value={selectedAnswer?.toString()}
        onValueChange={(value) => onAnswer(parseInt(value))}
        className="space-y-4"
      >
        {question.options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-4 rounded-lg border transition-colors hover:bg-gray-50"
          >
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
            />
            <Label
              htmlFor={`option-${index}`}
              className="flex-grow cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {/* Explanation (if provided and in review mode) */}
      {question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
