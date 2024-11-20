import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  onTick: (timeRemaining: number) => void;
}

export function Timer({ initialTime, onTimeUp, onTick }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        onTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, onTimeUp, onTick]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining <= 300; // 5 minutes or less

  return (
    <Card className={`flex items-center space-x-2 p-4 ${
      isLowTime ? "bg-red-50" : ""
    }`}>
      <Clock className={`h-5 w-5 ${isLowTime ? "text-red-500" : ""}`} />
      <span className={`font-mono text-lg ${isLowTime ? "text-red-500" : ""}`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
    </Card>
  );
}
