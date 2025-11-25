import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types';

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  // Запрос разрешений на уведомления
  static async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  // Создание напоминания для задачи
  static async scheduleTaskReminder(task: Task) {
    if (!task.reminder || task.reminder <= new Date()) {
      return null;
    }

    // Отменяем предыдущее уведомление если есть
    if (task.notificationId) {
      await this.cancelReminder(task.notificationId);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Напоминание о задаче',
        body: `"${task.title}"${task.dueDate ? ` (Срок: ${task.dueDate.toLocaleDateString()})` : ''}`,
        data: { taskId: task.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: task.reminder,
      },
    });

    return notificationId;
  }

  // Отмена напоминания
  static async cancelReminder(notificationId: string) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // Создание уведомления о просроченной задаче
  static async scheduleOverdueReminder(task: Task) {
    if (!task.dueDate || task.dueDate > new Date() || task.isCompleted || task.overdueNotificationSent) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Задача просрочена',
        body: `"${task.title}" должна была быть выполнена ${task.dueDate.toLocaleDateString()}`,
        data: { taskId: task.id },
        sound: true,
      },
      trigger: null, // Немедленное уведомление
    });

    return notificationId;
  }

  // Проверка просроченных задач и создание уведомлений
  static async checkOverdueTasks(tasks: Task[]) {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      !task.isCompleted &&
      !task.overdueNotificationSent
    );

    return overdueTasks; // Возвращаем список просроченных задач для store
  }

  // Удаление всех уведомлений для задачи
  static async removeTaskNotifications(taskId: string) {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const taskNotifications = notifications.filter(
      notification => notification.content.data?.taskId === taskId
    );
    
    for (const notification of taskNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}