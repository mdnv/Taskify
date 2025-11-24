import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskItem } from './TaskItem';
import { Task } from '../../types';

interface DraggableTaskItemProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  totalTasks: number;
}

export const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({
  task,
  index,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  totalTasks,
}) => {
  const { colors } = useTheme();

  const handleMoveUp = () => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const handleMoveDown = () => {
    if (index < totalTasks - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TaskItem
        task={task}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      <View style={styles.dragControls}>
        <TouchableOpacity
          style={[
            styles.dragButton,
            { backgroundColor: colors.surface },
            index === 0 && styles.disabledButton
          ]}
          onPress={handleMoveUp}
          disabled={index === 0}
        >
          <MaterialCommunityIcons
            name="chevron-up"
            size={20}
            color={index === 0 ? colors.textSecondary : colors.text}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.dragButton,
            { backgroundColor: colors.surface },
            index === totalTasks - 1 && styles.disabledButton
          ]}
          onPress={handleMoveDown}
          disabled={index === totalTasks - 1}
        >
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={index === totalTasks - 1 ? colors.textSecondary : colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  dragControls: {
    marginLeft: 8,
    gap: 4,
  },
  dragButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
});