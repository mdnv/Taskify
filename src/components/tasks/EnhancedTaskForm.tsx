import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  Switch, 
  Platform,
  TouchableOpacity,
  Animated 
} from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DatePicker } from '../common/DatePicker';
import { CategoryChip } from '../categories/CategoryChip';
import { Task, Category } from '../../types';
import { useCategoryStore } from '../../store/useCategoryStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimatedContainer } from '../animations/AnimatedComponents';
interface EnhancedTaskFormProps {
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'order'>) => void;
  onCancel: () => void;
}

export const EnhancedTaskForm: React.FC<EnhancedTaskFormProps> = ({ 
  task, 
  onSubmit, 
  onCancel 
}) => {
  const { colors } = useTheme();
  const { categories } = useCategoryStore();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [categoryId, setCategoryId] = useState<string | undefined>(task?.categoryId);
  const [dueDate, setDueDate] = useState<Date | undefined>(task?.dueDate);
  const [enableReminder, setEnableReminder] = useState(!!task?.reminder);
  const [reminderTime, setReminderTime] = useState<Date>(() => {
    // Устанавливаем время по умолчанию на 9:00 утра
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    return task?.reminder ? new Date(task.reminder) : defaultTime;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategoryId(task.categoryId);
      setDueDate(task.dueDate);
      setEnableReminder(!!task.reminder);
      if (task.reminder) {
        setReminderTime(new Date(task.reminder));
      }
    }
  }, [task]);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    let finalReminder: Date | undefined = undefined;
    
    if (enableReminder && dueDate) {
      // Создаем дату напоминания на основе dueDate и выбранного времени
      const reminderDate = new Date(dueDate);
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());
      reminderDate.setSeconds(0);
      reminderDate.setMilliseconds(0);
      
      finalReminder = reminderDate;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId,
      dueDate,
      reminder: finalReminder,
    });

    setError('');
  };

  const PriorityButton: React.FC<{ level: Task['priority']; label: string }> = ({ 
    level, 
    label 
  }) => (
    <View style={styles.priorityButtonWrapper}>
      <Button
        title={label}
        variant={priority === level ? 'primary' : 'outline'}
        onPress={() => setPriority(level)}
      />
    </View>
  );

  const selectedCategory = categories.find(cat => cat.id === categoryId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedContainer type="slideUp" delay={0}>
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
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={50}>
        <Input
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add more details..."
          multiline
        />
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={100}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            <PriorityButton level="low" label="Low" />
            <PriorityButton level="medium" label="Medium" />
            <PriorityButton level="high" label="High" />
          </View>
        </View>
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={150}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Category (Optional)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
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
        </ScrollView>
        {selectedCategory && (
          <View style={styles.selectedCategory}>
            <Text style={[styles.selectedCategoryText, { color: colors.textSecondary }]}>
              Selected: {selectedCategory.name}
            </Text>
          </View>
        )}
        </View>
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={200}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>Due Date (Optional)</Text>
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Select due date"
        />
        </View>
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={250}>
        <View style={styles.section}>
          <View style={styles.reminderHeader}>
            <View>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Reminder</Text>
              <Text style={[styles.reminderSubtitle, { color: colors.textSecondary }]}>
                Get notified before due date
              </Text>
            </View>
            <Switch
              value={enableReminder}
              onValueChange={setEnableReminder}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={enableReminder ? '#FFFFFF' : '#FFFFFF'}
              disabled={!dueDate}
            />
          </View>
          
          {enableReminder && dueDate && (
            <View style={styles.reminderContent}>
              <View style={styles.reminderInfo}>
                <MaterialCommunityIcons 
                  name="information" 
                  size={16} 
                  color={colors.textSecondary} 
                />
                <Text style={[styles.reminderText, { color: colors.textSecondary }]}>
                  You will be reminded on {dueDate.toLocaleDateString()} at{' '}
                  {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.timeButton, { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border 
                }]}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={20} 
                  color={colors.text} 
                />
                <Text style={[styles.timeButtonText, { color: colors.text }]}>
                  {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <MaterialCommunityIcons 
                  name="chevron-down" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}
          
          {enableReminder && !dueDate && (
            <View style={styles.warningContainer}>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={16} 
                color={colors.warning} 
              />
              <Text style={[styles.warningText, { color: colors.warning }]}>
                Please set a due date to enable reminders
              </Text>
            </View>
          )}
        </View>
      </AnimatedContainer>

      <AnimatedContainer type="slideUp" delay={300}>
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
      </AnimatedContainer>
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
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButtonWrapper: {
    flex: 1,
  },
  categoriesContent: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 0,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reminderContent: {
    marginTop: 12,
    gap: 12,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reminderText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  warningText: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
});

export default EnhancedTaskForm;