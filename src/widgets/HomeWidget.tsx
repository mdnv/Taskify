import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface HomeWidgetProps {
  tasks: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
  onToggleTask: (taskId: string) => void;
  onOpenApp: () => void;
}

const { width } = Dimensions.get('window');

export const HomeWidget: React.FC<HomeWidgetProps> = ({
  tasks,
  onToggleTask,
  onOpenApp,
}) => {
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade in animation
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTaskPress = (taskId: string) => {
    // Vibration effect with scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleTask(taskId);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const widgetSize = Math.min(width - 32, 300); // Widget max size

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Header */}
      <TouchableOpacity
        onPress={onOpenApp}
        style={styles.headerButton}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleSection}>
            <View style={styles.iconBadge}>
              <MaterialCommunityIcons name="check-all" size={18} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Taskify</Text>
              <Text style={styles.headerSubtitle}>
                {completedCount}/{totalTasks} Complete
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#6366F1" />
        </View>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <View style={[styles.statCircle, { backgroundColor: '#6366F1' }]}>
            <Text style={styles.statCircleText}>{totalTasks}</Text>
          </View>
          <Text style={styles.quickStatLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.quickStatItem}>
          <View style={[styles.statCircle, { backgroundColor: '#10B981' }]}>
            <Text style={styles.statCircleText}>{completedCount}</Text>
          </View>
          <Text style={styles.quickStatLabel}>Done</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.quickStatItem}>
          <View style={[styles.statCircle, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.statCircleText}>{pendingTasks.length}</Text>
          </View>
          <Text style={styles.quickStatLabel}>Pending</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Tasks Preview */}
      {totalTasks === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={40} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptyDescription}>Tap to create one</Text>
        </View>
      ) : pendingTasks.length === 0 ? (
        <View style={styles.celebrationState}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationText}>All tasks done!</Text>
        </View>
      ) : (
        <View style={styles.tasksPreview}>
          {pendingTasks.slice(0, 2).map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.previewTaskItem,
                index === 0 && styles.firstTaskItem,
              ]}
              onPress={() => handleTaskPress(task.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.taskPriorityBar,
                  { backgroundColor: getPriorityColor(task.priority) },
                ]}
              />
              <Text style={styles.previewTaskText} numberOfLines={1}>
                {task.title}
              </Text>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color="#10B981"
              />
            </TouchableOpacity>
          ))}

          {pendingTasks.length > 2 && (
            <TouchableOpacity
              style={styles.viewMoreItem}
              onPress={onOpenApp}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                View {pendingTasks.length - 2} more →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onOpenApp}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Add Task</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  headerButton: {
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  quickStatItem: {
    alignItems: 'center',
    gap: 6,
  },
  statCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCircleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  quickStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  progressWrapper: {
    marginBottom: 14,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 5,
  },
  tasksPreview: {
    marginBottom: 12,
    gap: 8,
  },
  firstTaskItem: {
    marginBottom: 4,
  },
  previewTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
  },
  taskPriorityBar: {
    width: 3,
    height: 28,
    borderRadius: 2,
  },
  previewTaskText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
  },
  viewMoreItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  emptyDescription: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  celebrationState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  celebrationEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  celebrationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#6366F1',
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});
