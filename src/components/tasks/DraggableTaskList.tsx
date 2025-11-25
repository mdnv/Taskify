import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { DraggableTaskItem } from './DraggableTaskItem';
import { EmptyState } from '../ui/EmptyState';
import { Task } from '../../types';
import { AnimatedContainer } from '../animations/AnimatedComponents';

interface DraggableTaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (fromIndex: number, toIndex: number) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export const DraggableTaskList: React.FC<DraggableTaskListProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onReorderTasks,
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
          <DraggableTaskItem
            task={item}
            index={index}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onReorder={onReorderTasks}
            totalTasks={tasks.length}
          />
        </AnimatedContainer>
      )}
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingVertical: 8,
  },
});