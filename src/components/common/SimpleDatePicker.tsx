import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export const SimpleDatePicker: React.FC<{
  value?: Date;
  onChange: (date: Date) => void;
}> = ({ value, onChange }) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.text, { color: colors.text }]}>
          {value ? value.toLocaleDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});