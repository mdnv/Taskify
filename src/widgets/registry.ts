import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetService } from '../utils/widgetService';
import { useTaskStore } from '../store/useTaskStore';
import { Platform } from 'react-native';

// Регистрация обработчика действий виджета только на Android
if (Platform.OS === 'android') {
  try {
    registerWidgetTaskHandler(async (props: any) => {
      const { action, taskId } = props;
      const { toggleCompletion } = useTaskStore.getState();
      
      switch (action) {
        case 'TOGGLE_TASK':
          if (taskId) {
            await toggleCompletion(taskId);
          }
          break;
        
        case 'ADD_TASK':
          // Здесь можно открыть экран добавления задачи
          // Пока просто логируем
          console.log('Add task from widget');
          break;
        
        case 'OPEN_APP':
          // Открыть приложение
          console.log('Open app from widget');
          break;
        
        default:
          console.log('Unknown widget action:', action);
      }
    });
  } catch (error) {
    console.log('Widget handler registration failed:', error);
  }
}