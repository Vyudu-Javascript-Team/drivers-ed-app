import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionNavProps {
  total: number;
  current: number;
  answers: Record<string, number>;
  onChange: (index: number) => void;
}

export function QuestionNav({
  total,
  current,
  answers,
  onChange,
}: QuestionNavProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {Array.from({ length: total }, (_, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          className={cn(
            "w-10 h-10",
            current === i && "border-primary",
            answers[i] !== undefined && "bg-primary/10"
          )}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}
