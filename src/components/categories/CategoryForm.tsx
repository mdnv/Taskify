import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Category } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Omit<Category, 'id' | 'taskCount'>) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#6B7280', '#84CC16'
];

const ICON_OPTIONS = [
  'account', 'briefcase', 'cart', 'heart', 'home', 'star', 
  'book', 'flag', 'food', 'gift', 'music', 'phone'
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState(category?.icon || ICON_OPTIONS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
      setIcon(category.icon);
    }
  }, [category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    onSubmit({
      name: name.trim(),
      color,
      icon,
    });

    setError('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Input
        label="Category Name *"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError('');
        }}
        placeholder="Enter category name"
        error={error}
      />

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Color</Text>
        <View style={styles.colorGrid}>
          {COLOR_OPTIONS.map((colorOption) => (
            <TouchableOpacity
              key={colorOption}
              style={[
                styles.colorOption,
                { backgroundColor: colorOption },
                color === colorOption && styles.colorSelected,
              ]}
              onPress={() => setColor(colorOption)}
            >
              {color === colorOption && (
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Icon</Text>
        <View style={styles.iconGrid}>
          {ICON_OPTIONS.map((iconOption) => (
            <TouchableOpacity
              key={iconOption}
              style={[
                styles.iconOption,
                { backgroundColor: colors.surface },
                icon === iconOption && { backgroundColor: colors.primary },
              ]}
              onPress={() => setIcon(iconOption)}
            >
              <MaterialCommunityIcons
                name={iconOption as any}
                size={20}
                color={icon === iconOption ? '#FFFFFF' : colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.preview}>
        <Text style={[styles.previewLabel, { color: colors.text }]}>Preview</Text>
        <View style={[styles.previewChip, { backgroundColor: color }]}>
          <MaterialCommunityIcons
            name={icon as any}
            size={16}
            color="#FFFFFF"
          />
          <Text style={styles.previewText}>{name || 'Category Name'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          fullWidth
        />
        <Button
          title={category ? 'Update Category' : 'Create Category'}
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
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  previewText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  actions: {
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
});

// Add missing import
import { TouchableOpacity } from 'react-native';