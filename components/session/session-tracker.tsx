'use client';

import { useEffect } from 'react';
import { socket } from '@/lib/socket';

let sessionStartTime = Date.now();
let lastActivityTime = Date.now();

export function SessionTracker() {
  useEffect(() => {
    const trackActivity = () => {
      lastActivityTime = Date.now();
      socket.emit('activity', {
        timestamp: lastActivityTime,
      });
    };

    // Track user activity
    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keypress', trackActivity);
    window.addEventListener('click', trackActivity);
    window.addEventListener('scroll', trackActivity);

    // Start session
    socket.emit('sessionStart', {
      timestamp: sessionStartTime,
    });

    // Check for inactivity
    const inactivityCheck = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime;
      if (inactivityTime > 5 * 60 * 1000) { // 5 minutes
        socket.emit('sessionEnd', {
          startTime: sessionStartTime,
          endTime: lastActivityTime,
          duration: lastActivityTime - sessionStartTime,
        });
        
        // Start new session when activity resumes
        sessionStartTime = Date.now();
      }
    }, 60 * 1000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keypress', trackActivity);
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      clearInterval(inactivityCheck);

      // End session on unmount
      socket.emit('sessionEnd', {
        startTime: sessionStartTime,
        endTime: Date.now(),
        duration: Date.now() - sessionStartTime,
      });
    };
  }, []);

  return null;
}