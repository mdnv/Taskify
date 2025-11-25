import React, { useEffect } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { widgetService } from './widgetService';

interface WidgetCallData {
  type: 'COMPLETE_TASK' | 'DELETE_TASK' | 'TOGGLE_TASK' | 'GET_TASKS' | 'OPEN_APP';
  taskId?: string;
  payload?: any;
}

/**
 * Обработчик событий от нативного виджета
 * Работает с AsyncStorage для синхронизации данных с виджетом
 * 
 * Поддерживает:
 * - Android: Синхронизация через AsyncStorage
 * - iOS: Синхронизация через AppGroups (NSUserDefaults)
 */
export const setupWidgetCallHandler = (): (() => void) => {
  const taskStore = useTaskStore.getState();
  let appStateSubscription: any = null;

  // Инициализировать синхронизацию при изменении состояния приложения
  const handleAppStateChange = (state: AppStateStatus) => {
    if (state === 'active') {
      // Приложение вернулось в фокус - обновить данные из виджета
      updateWidgetData();
    }
  };

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  
  // Первоначальное обновление
  updateWidgetData();

  return () => {
    if (appStateSubscription) {
      appStateSubscription.remove();
    }
  };
};

/**
 * Обновить данные виджета
 * Сохраняет данные в AsyncStorage для доступа из нативного виджета
 */
export const updateWidgetData = (): void => {
  try {
    const tasks = useTaskStore.getState().tasks;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const total = tasks.length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    const widgetData = {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      progressPercent: percent,
      tasks: tasks
        .filter((t) => !t.isCompleted)
        .slice(0, 5)
        .map((task) => ({
          id: task.id,
          title: task.title,
          isCompleted: task.isCompleted,
          priority: task.priority,
          dueDate: task.dueDate?.toISOString(),
        })),
      lastUpdated: Date.now(),
    };

    // Сохранить в AsyncStorage для доступа из нативного виджета
    widgetService.updateWidget(tasks);
    
    console.log('[WidgetCallHandler] Widget data synced:', {
      platform: Platform.OS,
      tasks: widgetData.totalTasks,
      completed: widgetData.completedTasks,
    });
  } catch (error) {
    console.error('[WidgetCallHandler] Error updating widget data:', error);
  }
}

/**
 * Отправить событие обратно в виджет
 */
export const sendEventToWidget = (event: {
  type: 'SUCCESS' | 'ERROR' | 'INFO';
  message: string;
}): void => {
  try {
    console.log('[WidgetCallHandler] Event:', event);
  } catch (error) {
    console.error('[WidgetCallHandler] Error sending event:', error);
  }
}

/**
 * Hook для инициализации обработчика виджета
 */
export const useWidgetCallHandler = (): void => {
  useEffect(() => {
    const cleanup = setupWidgetCallHandler();
    return cleanup;
  }, []);
};
