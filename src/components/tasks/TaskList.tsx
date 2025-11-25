import React from 'react';
import { FlatList, StyleSheet, View, Animated } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { TaskItem } from './TaskItem';
import { EmptyState } from '../ui/EmptyState';
import { Task } from '../../types';
import { AnimatedContainer } from '../animations/AnimatedComponents';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  refreshing = false,
  onRefresh,
}) => {
  const { colors } = useTheme();

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="checkbox-blank-outline"
        title="No tasks yet"
        message="Add your first task to get started with Taskify!"
      />
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <AnimatedContainer type="slideUp" delay={index * 50}>
          <TaskItem
            task={item}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        </AnimatedContainer>
      )}
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  separator: {
    height: 8,
  },
});