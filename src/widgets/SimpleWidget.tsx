import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SimpleWidgetProps {
  tasks: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
  onToggleTask: (taskId: string) => void;
  onOpenApp: () => void;
}

export const SimpleWidget: React.FC<SimpleWidgetProps> = ({
  tasks,
  onToggleTask,
  onOpenApp,
}) => {
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow Pro</Text>
        <TouchableOpacity onPress={onOpenApp} style={styles.openButton}>
          <MaterialCommunityIcons name="open-in-new" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {completedCount}/{totalTasks} completed
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%`,
            },
          ]}
        />
      </View>

      <View style={styles.tasksList}>
        {pendingTasks.slice(0, 3).map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => onToggleTask(task.id)}
          >
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            />
            <Text style={styles.taskText} numberOfLines={1}>
              {task.title}
            </Text>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={18}
              color="#10B981"
            />
          </TouchableOpacity>
        ))}

        {pendingTasks.length === 0 && (
          <Text style={styles.emptyText}>All tasks completed! 🎉</Text>
        )}

        {pendingTasks.length > 3 && (
          <Text style={styles.moreText}>
            +{pendingTasks.length - 3} more tasks
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  openButton: {
    padding: 4,
  },
  stats: {
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#64748B',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  tasksList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
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
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  moreText: {
    fontSize: 11,
    color: '#6366F1',
    textAlign: 'center',
    marginTop: 4,
  },
});
