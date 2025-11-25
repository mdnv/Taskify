import { Task } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WidgetService {
  private widgetName = 'TaskifyWidget';
  private listeners: Array<(tasks: Task[]) => void> = [];

  // Subscribe to widget updates
  subscribe(callback: (tasks: Task[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners(tasks: Task[]) {
    this.listeners.forEach(listener => listener(tasks));
  }

  // Update widget data in storage
  async updateWidget(tasks: Task[]) {
    try {
      const widgetData = {
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          isCompleted: task.isCompleted,
          priority: task.priority,
          dueDate: task.dueDate?.toISOString(),
          description: task.description,
        })),
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.isCompleted).length,
        pendingTasks: tasks.filter(task => !task.isCompleted).length,
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(
        `@${this.widgetName}:data`,
        JSON.stringify(widgetData)
      );

      this.notifyListeners(tasks);

      console.log('[WidgetService] Widget data updated successfully');
    } catch (error) {
      console.error('[WidgetService] Failed to update widget:', error);
    }
  }

  // Get widget data from storage
  async getWidgetData() {
    try {
      const data = await AsyncStorage.getItem(`@${this.widgetName}:data`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[WidgetService] Failed to get widget data:', error);
      return null;
    }
  }

  // Clear widget data
  async clearWidget() {
    try {
      await AsyncStorage.removeItem(`@${this.widgetName}:data`);
      console.log('[WidgetService] Widget data cleared');
    } catch (error) {
      console.error('[WidgetService] Failed to clear widget:', error);
    }
  }

  // Handle widget actions (called when user interacts with home screen widget)
  async handleWidgetAction(action: string, taskId?: string) {
    switch (action) {
      case 'ADD_TASK':
        console.log('[WidgetService] ADD_TASK action');
        // Will be handled by app navigation
        break;

      case 'OPEN_APP':
        console.log('[WidgetService] OPEN_APP action');
        // App will handle opening to home screen
        break;

      case 'TOGGLE_TASK':
        if (taskId) {
          console.log('[WidgetService] TOGGLE_TASK action for task:', taskId);
          // Will be handled by app task store
        }
        break;

      case 'REFRESH':
        console.log('[WidgetService] REFRESH action');
        // Trigger widget refresh
        break;

      default:
        console.log('[WidgetService] Unknown widget action:', action);
    }
  }

  // Initialize widget on app start
  async initializeWidget(tasks: Task[]) {
    try {
      await this.updateWidget(tasks);
      console.log('[WidgetService] Widget initialized');
    } catch (error) {
      console.error('[WidgetService] Failed to initialize widget:', error);
    }
  }
}

export const widgetService = new WidgetService();