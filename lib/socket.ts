import { io } from 'socket.io-client';
import { notificationManager } from './notifications';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
  autoConnect: false,
});

export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();

  // Handle real-time events
  socket.on('progressUpdate', (data) => {
    notificationManager.sendNotification(
      'Progress Update',
      { body: `${data.user} has completed ${data.progress}% of ${data.activity}` }
    );
  });

  socket.on('achievementUnlocked', (data) => {
    notificationManager.sendNotification(
      'Achievement Unlocked! 🏆',
      { body: `Congratulations! You've earned the "${data.title}" achievement!` }
    );
  });

  socket.on('studyReminder', (data) => {
    notificationManager.sendNotification(
      'Study Reminder 📚',
      { body: data.message }
    );
  });

  socket.on('newChallenge', (data) => {
    notificationManager.sendNotification(
      'New Challenge Available! 🎯',
      { body: data.description }
    );
  });

  socket.on('leaderboardUpdate', (data) => {
    if (data.userId === userId && data.rank <= 3) {
      notificationManager.sendNotification(
        'Leaderboard Update 🏅',
        { body: `You're now ranked #${data.rank} in ${data.state}!` }
      );
    }
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};