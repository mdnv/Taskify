import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { lightTheme, darkTheme } from '../constants/themes';

export interface TaskPreview {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface WidgetData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progressPercent: number;
  tasks: TaskPreview[];
  lastUpdated: number;
}

interface NativeWidgetProps {
  onTaskComplete?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onOpenApp?: () => void;
}

/**
 * Interactive Native Widget Component
 * Это компонент, который будет отображаться на главном экране телефона
 * Пользователь может выполнять задачи БЕЗ открытия приложения
 */
export const NativeWidget: React.FC<NativeWidgetProps> = ({
  onTaskComplete,
  onTaskDelete,
  onOpenApp,
}) => {
  const tasks = useTaskStore((state) => state.tasks);
  const settings = useSettingsStore((state) => state.settings);
  const colors = settings.theme === 'dark' ? darkTheme : lightTheme;

  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Подготовить данные для виджета
  useEffect(() => {
    const completed = tasks.filter((t) => t.isCompleted).length;
    const total = tasks.length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Взять первые 3 задачи для превью
    const preview = tasks
      .sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        return (b.dueDate?.getTime() || 0) - (a.dueDate?.getTime() || 0);
      })
      .slice(0, 3)
      .map((task) => ({
        id: task.id,
        title: task.title,
        isCompleted: task.isCompleted,
        priority: task.priority,
      }));

    setWidgetData({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      progressPercent: percent,
      tasks: preview,
      lastUpdated: Date.now(),
    });
  }, [tasks]);

  const handleTaskToggle = (taskId: string) => {
    setLoadingTaskId(taskId);

    // Анимация нажатия
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Вызвать callback или обновить task
    if (onTaskComplete) {
      onTaskComplete(taskId);
    } else {
      useTaskStore.getState().toggleCompletion(taskId);
    }

    setTimeout(() => setLoadingTaskId(null), 300);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
      default:
        return colors.success;
    }
  };

  if (!widgetData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Taskify</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {widgetData.pendingTasks} задач
        </Text>
      </View>

      {/* Прогресс бар */}
      <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: colors.primary,
              width: `${widgetData.progressPercent}%`,
            },
          ]}
        />
      </View>

      {/* Статистика */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {widgetData.completedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>выполнено</Text>
        </View>
        <View
          style={[styles.divider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {widgetData.pendingTasks}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ожидают</Text>
        </View>
        <View
          style={[styles.divider, { backgroundColor: colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {widgetData.totalTasks}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>всего</Text>
        </View>
      </View>

      {/* Список задач */}
      {widgetData.tasks.length > 0 ? (
        <View style={styles.tasksSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Быстрые действия:</Text>
          {widgetData.tasks.map((task) => (
            <View key={task.id} style={styles.quickTaskContainer}>
              <TouchableOpacity
                style={[
                  styles.quickTask,
                  {
                    backgroundColor: task.isCompleted ? colors.success : colors.background,
                    borderLeftColor: getPriorityColor(task.priority),
                  },
                ]}
                onPress={() => handleTaskToggle(task.id)}
                disabled={loadingTaskId === task.id}
                activeOpacity={0.7}
              >
                <View style={styles.taskCheckbox}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: task.isCompleted ? colors.success : colors.border,
                      },
                    ]}
                  >
                    {task.isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>

                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskTitle,
                      {
                        color: task.isCompleted ? colors.textSecondary : colors.text,
                        textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                </View>

                {loadingTaskId === task.id && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.loader}
                  />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Нет задач 🎉
          </Text>
        </View>
      )}

      {/* Кнопка открыть приложение */}
      <TouchableOpacity
        style={[styles.openButton, { backgroundColor: colors.primary }]}
        onPress={onOpenApp}
        activeOpacity={0.8}
      >
        <Text style={styles.openButtonText}>Открыть приложение</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
  },
  divider: {
    width: 1,
    marginHorizontal: 8,
  },
  tasksSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickTaskContainer: {
    marginBottom: 6,
  },
  quickTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  taskCheckbox: {
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  loader: {
    marginLeft: 8,
  },
  emptyContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 12,
  },
  openButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
