import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryChip } from '../categories/CategoryChip';
import { Task } from '../../types';
import { priorityColors } from '../../constants/themes';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { useCategoryStore } from '../../store/useCategoryStore';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const { colors } = useTheme();
  const { getCategoryById } = useCategoryStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const category = task.categoryId ? getCategoryById(task.categoryId) : undefined;

  const handleToggle = () => {
    // Bounce animation
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

    onToggle(task.id);
  };

  const getPriorityColor = () => {
    return priorityColors[task.priority];
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;

    const now = new Date();
    let text = format(task.dueDate, 'MMM dd');
    let color: string = colors.textSecondary;

    if (isToday(task.dueDate)) {
      text = 'Today';
      color = colors.warning;
    } else if (isTomorrow(task.dueDate)) {
      text = 'Tomorrow';
      color = colors.warning;
    } else if (isPast(task.dueDate) && !task.isCompleted) {
      text = format(task.dueDate, 'MMM dd');
      color = colors.error;
    }

    return { text, color };
  };

  const dueDateInfo = getDueDateText();

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={handleToggle}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: task.isCompleted ? colors.success : colors.border,
              backgroundColor: task.isCompleted ? colors.success : 'transparent',
            },
          ]}
        >
          {task.isCompleted && (
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: task.isCompleted ? colors.textSecondary : colors.text,
            },
            task.isCompleted && styles.completedText,
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        
        {task.description && (
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
              },
              task.isCompleted && styles.completedText,
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.leftFooter}>
            <View
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor() },
              ]}
            />
            <Text
              style={[
                styles.priorityText,
                { color: colors.textSecondary },
              ]}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
            
            {dueDateInfo && (
              <View style={styles.dueDate}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={12}
                  color={dueDateInfo.color}
                />
                <Text style={[styles.dueDateText, { color: dueDateInfo.color }]}>
                  {dueDateInfo.text}
                </Text>
              </View>
            )}
          </View>

          {category && (
            <CategoryChip
              category={category}
              size="small"
              showCount={false}
            />
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(task.id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={colors.error}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxContainer: {
    paddingRight: 12,
    paddingTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});