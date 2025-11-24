import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { Button } from '../common/Button';

export const TestTaskForm: React.FC<{
  onSubmit: (task: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { colors } = useTheme();
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleSetDueDate = () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1); // Завтра
    setDueDate(newDate);
    Alert.alert('Due Date Set', `Due date: ${newDate.toLocaleDateString()}`);
  };

  const handleTestSubmit = () => {
    onSubmit({
      title: 'Test Task',
      description: 'This is a test task',
      priority: 'medium',
      dueDate: dueDate,
      reminder: dueDate ? new Date(dueDate.getTime() - 60 * 60 * 1000) : undefined, // За 1 час до dueDate
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Test Form</Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSetDueDate}
      >
        <Text style={styles.buttonText}>Set Due Date (Tomorrow)</Text>
      </TouchableOpacity>

      <Text style={[styles.dateText, { color: colors.text }]}>
        Due Date: {dueDate ? dueDate.toLocaleDateString() : 'Not set'}
      </Text>

      <View style={styles.actions}>
        <Button title="Cancel" variant="outline" onPress={onCancel} fullWidth />
        <Button title="Create Test Task" onPress={handleTestSubmit} fullWidth />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});