import React from 'react';
import { View, Text as RNText, StyleSheet } from 'react-native';
import { WidgetProps } from './TaskWidget.types';

export function TaskWidget({ tasks, totalTasks, completedTasks }: WidgetProps) {
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedCount = tasks.filter(task => task.isCompleted).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <RNText style={styles.header}>Taskify</RNText>
      
      {/* Stats */}
      <RNText style={styles.stats}>
        {completedCount}/{totalTasks} completed
      </RNText>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[
          styles.progressBar,
          { width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }
        ]} />
      </View>

      {/* Pending Tasks List */}
      <View style={styles.tasksList}>
        {pendingTasks.slice(0, 3).map((task, index) => (
          <View key={task.id} style={styles.taskItem}>
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: getPriorityColor(task.priority) }
            ]} />
            <RNText 
              style={styles.taskText}
              numberOfLines={1}
            >
              {task.title}
            </RNText>
            {task.dueDate && (
              <RNText style={styles.dueDate}>
                {formatDueDate(task.dueDate)}
              </RNText>
            )}
          </View>
        ))}
        
        {pendingTasks.length === 0 && (
          <RNText style={styles.emptyText}>All tasks completed! 🎉</RNText>
        )}
        
        {pendingTasks.length > 3 && (
          <RNText style={styles.moreText}>
            +{pendingTasks.length - 3} more tasks
          </RNText>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <RNText style={styles.actionText}>
          ➕ Add Task
        </RNText>
        <RNText style={styles.actionText}>
          📱 Open App
        </RNText>
      </View>
    </View>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
    default: return '#6B7280';
  }
}

function formatDueDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold' as any,
    color: '#1E293B',
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden' as any,
    marginBottom: 12,
  },
  progressBar: {
    height: '100%' as any,
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  tasksList: {
    gap: 6,
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row' as any,
    alignItems: 'center' as any,
    gap: 8,
  },
  priorityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  taskText: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
  },
  dueDate: {
    fontSize: 10,
    color: '#64748B',
    fontStyle: 'italic' as any,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center' as any,
    fontStyle: 'italic' as any,
  },
  moreText: {
    fontSize: 11,
    color: '#6366F1',
    textAlign: 'center' as any,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row' as any,
    justifyContent: 'space-between' as any,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500' as any,
  },
});