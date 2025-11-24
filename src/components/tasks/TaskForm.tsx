import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DatePicker } from '../common/DatePicker';
import { CategoryChip } from '../categories/CategoryChip';
import { Task, Category } from '../../types';
import { useCategoryStore } from '../../store/useCategoryStore';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted'>) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { colors } = useTheme();
  const { categories } = useCategoryStore();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [categoryId, setCategoryId] = useState<string | undefined>(task?.categoryId);
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategoryId(task.categoryId);
      setDueDate(task.dueDate);
    }
  }, [task]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId,
      dueDate,
      order: task?.order || 0,
    });

    setError('');
  };

  const PriorityButton: React.FC<{ level: Task['priority']; label: string }> = ({ level, label }) => (
    <Button
      title={label}
      variant={priority === level ? 'primary' : 'outline'}
      onPress={() => setPriority(level)}
    />
  );

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Input
        label="Title *"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          setError('');
        }}
        placeholder="What needs to be done?"
        error={error}
      />

      <Input
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Add more details..."
        multiline
      />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Priority</Text>
        <View style={styles.priorityContainer}>
          <PriorityButton level="low" label="Low" />
          <PriorityButton level="medium" label="Medium" />
          <PriorityButton level="high" label="High" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Category (Optional)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          <View style={styles.categoriesList}>
            <TouchableOpacity
              style={[
                styles.categoryOption,
                { 
                  backgroundColor: !categoryId ? colors.primary : colors.surface,
                  borderColor: colors.border 
                }
              ]}
              onPress={() => setCategoryId(undefined)}
            >
              <Text style={[
                styles.categoryOptionText,
                { color: !categoryId ? '#FFFFFF' : colors.text }
              ]}>
                None
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={categoryId === category.id}
                onPress={() => setCategoryId(category.id)}
                size="small"
              />
            ))}
          </View>
        </ScrollView>
        {selectedCategory && (
          <View style={styles.selectedCategory}>
            <Text style={[styles.selectedCategoryText, { color: colors.textSecondary }]}>
              Selected: {selectedCategory.name}
            </Text>
          </View>
        )}
      </View>

      <DatePicker
        label="Due Date (Optional)"
        value={dueDate}
        onChange={setDueDate}
        placeholder="Select due date"
      />

      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          fullWidth
        />
        <Button
          title={task ? 'Update Task' : 'Add Task'}
          onPress={handleSubmit}
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoriesContainer: {
    marginHorizontal: -16,
  },
  categoriesList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedCategory: {
    marginTop: 8,
  },
  selectedCategoryText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
});

// Add missing import
import { TouchableOpacity } from 'react-native';