import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade in animation
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTaskPress = (taskId: string) => {
    // Pulse animation on task toggle
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

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="check-all" size={20} color="#6366F1" />
          <Text style={styles.title}>Taskify</Text>
        </View>
        <TouchableOpacity 
          onPress={onOpenApp} 
          style={styles.openButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="open-in-new" size={16} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
        </View>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {totalTasks === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="check-circle" size={40} color="#10B981" />
          <Text style={styles.emptyText}>No tasks yet!</Text>
          <Text style={styles.emptySubtext}>Create your first task</Text>
        </View>
      ) : (
        <View style={styles.tasksList}>
          {pendingTasks.length === 0 ? (
            <View style={styles.completedContainer}>
              <MaterialCommunityIcons name="party-popper" size={32} color="#F59E0B" />
              <Text style={styles.completedText}>All done! 🎉</Text>
            </View>
          ) : (
            <>
              {pendingTasks.slice(0, 3).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskItem}
                  onPress={() => handleTaskPress(task.id)}
                  activeOpacity={0.7}
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
                  <View style={styles.checkIcon}>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={18}
                      color="#10B981"
                    />
                  </View>
                </TouchableOpacity>
              ))}

              {pendingTasks.length > 3 && (
                <View style={styles.moreTasksContainer}>
                  <Text style={styles.moreText}>
                    +{pendingTasks.length - 3} more tasks
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  openButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F4FF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6366F1',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
    borderRadius: 4,
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
  },
  checkIcon: {
    padding: 4,
  },
  priorityIndicator: {
    width: 3,
    height: 24,
    borderRadius: 1.5,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 8,
  },
  moreTasksContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
});
