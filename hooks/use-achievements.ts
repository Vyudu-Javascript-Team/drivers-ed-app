import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useAchievements() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/achievements')
        .then((res) => res.json())
        .then((data) => {
          setAchievements(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch achievements:', error);
          setLoading(false);
        });
    }
  }, [session]);

  return {
    achievements,
    loading,
  };
}