import { useState, useCallback } from 'react';
import confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function useConfetti() {
  const [isActive, setIsActive] = useState(false);
  const { width, height } = useWindowSize();

  const triggerConfetti = useCallback(() => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 5000);
  }, []);

  const ConfettiComponent = isActive ? (
    <confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
    />
  ) : null;

  return {
    triggerConfetti,
    ConfettiComponent,
  };
}