import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useReminders() {
  const { data: session } = useSession();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchReminders();
    }
  }, [session]);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      const data = await response.json();
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async (time: string, days: number[]) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, days }),
      });
      const data = await response.json();
      setReminders([...reminders, data]);
      return data;
    } catch (error) {
      console.error('Failed to create reminder:', error);
      throw error;
    }
  };

  return {
    reminders,
    loading,
    createReminder,
  };
}