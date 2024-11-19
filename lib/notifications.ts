import { toast } from 'sonner';

class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  static getInstance() {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    }
    return 'denied';
  }

  async sendNotification(title: string, options: NotificationOptions = {}) {
    if (this.permission !== 'granted') {
      await this.requestPermission();
    }

    if (this.permission === 'granted') {
      const notification = new Notification(title, options);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // Also show in-app notification
    toast(title, {
      description: options.body,
    });
  }

  scheduleReminder(timestamp: number, title: string, body: string) {
    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(title, { body });
      }, delay);
    }
  }
}

export const notificationManager = NotificationManager.getInstance();