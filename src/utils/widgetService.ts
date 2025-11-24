import { Task } from '../types';

class WidgetService {
  private widgetName = 'TaskFlowWidget';

  // Обновление данных виджета
  async updateWidget(tasks: Task[]) {
    try {
      const widgetTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        isCompleted: task.isCompleted,
        priority: task.priority,
        dueDate: task.dueDate?.toISOString(),
      }));

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.isCompleted).length;

      // Widget update would go here
      console.log('Widget updated:', {
        tasks: widgetTasks,
        totalTasks,
        completedTasks,
      });
    } catch (error) {
      console.log('Widget update error:', error);
    }
  }

  // Обновление при изменении задач
  async onTasksChange(tasks: Task[]) {
    await this.updateWidget(tasks);
  }

  // Обработка кликов по виджету
  async handleWidgetAction(action: string, taskId?: string) {
    switch (action) {
      case 'ADD_TASK':
        // Открыть приложение на экране добавления задачи
        // Это будет обработано в App.tsx
        break;
      
      case 'OPEN_APP':
        // Просто открыть приложение
        // Это будет обработано в App.tsx
        break;
      
      case 'TOGGLE_TASK':
        if (taskId) {
          // Переключить статус задачи
          // Это будет обработано в App.tsx
        }
        break;
      
      default:
        console.log('Unknown widget action:', action);
    }
  }
}

export const widgetService = new WidgetService();