import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  minimumDate = new Date(),
}) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // На iOS оставляем открытым, на Android закрываем
    
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    } else if (event.type === 'dismissed') {
      // User cancelled
      if (Platform.OS === 'android') {
        setShowPicker(false);
      }
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const displayValue = value ? format(value, 'MMM dd, yyyy') : '';

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={[
              styles.text,
              { color: value ? colors.text : colors.textSecondary },
            ]}
          >
            {value ? displayValue : placeholder}
          </Text>
          <MaterialCommunityIcons
            name="calendar"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        
        {value && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  text: {
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
});