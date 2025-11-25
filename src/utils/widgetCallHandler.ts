import React, { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { widgetService } from './widgetService';

interface WidgetCallData {
  type: 'COMPLETE_TASK' | 'DELETE_TASK' | 'TOGGLE_TASK' | 'GET_TASKS' | 'OPEN_APP';
  taskId?: string;
  payload?: any;
}

/**
 * Обработчик событий от нативного виджета
 * Получает команды из виджета и выполняет соответствующие действия
 */
export const setupWidgetCallHandler = (): (() => void) => {
  const taskStore = useTaskStore.getState();

  const handleWidgetCall = (event: any) => {
    console.log('[WidgetCallHandler] Event received:', event);

    try {
      const data: WidgetCallData = typeof event === 'string' ? JSON.parse(event) : event;

      switch (data.type) {
        case 'COMPLETE_TASK': {
          if (data.taskId) {
            taskStore.toggleCompletion(data.taskId);
            updateWidgetData();
            sendEventToWidget({
              type: 'SUCCESS',
              message: `Задача выполнена!`,
            });
          }
          break;
        }

        case 'DELETE_TASK': {
          if (data.taskId) {
            taskStore.deleteTask(data.taskId);
            updateWidgetData();
            sendEventToWidget({
              type: 'SUCCESS',
              message: `Задача удалена!`,
            });
          }
          break;
        }

        case 'TOGGLE_TASK': {
          if (data.taskId) {
            taskStore.toggleCompletion(data.taskId);
            updateWidgetData();
            const task = taskStore.tasks.find((t) => t.id === data.taskId);
            const status = task?.isCompleted ? 'выполнена' : 'восстановлена';
            sendEventToWidget({
              type: 'SUCCESS',
              message: `Задача ${status}!`,
            });
          }
          break;
        }

        case 'GET_TASKS': {
          updateWidgetData();
          break;
        }

        case 'OPEN_APP': {
          // Это не требуется обрабатывать, система сама откроет приложение
          console.log('[WidgetCallHandler] Opening app...');
          break;
        }

        default:
          console.warn('[WidgetCallHandler] Unknown event type:', data.type);
      }
    } catch (error) {
      console.error('[WidgetCallHandler] Error processing event:', error);
      sendEventToWidget({
        type: 'ERROR',
        message: 'Ошибка при обработке действия',
      });
    }
  };

  // В реальном приложении здесь нужно было бы подписаться на события виджета
  // Для теперь это просто коллбэк
  (global as any).widgetCallHandler = handleWidgetCall;

  // Отправить начальные данные
  updateWidgetData();

  // Вернуть функцию для очистки
  return () => {
    delete (global as any).widgetCallHandler;
  };
};

/**
 * Обновить данные виджета
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
    console.log('[WidgetCallHandler] Widget data updated:', widgetData);
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
    console.log('[WidgetCallHandler] Event sent:', event);
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
