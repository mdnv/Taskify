import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../ui/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category } from '../../types';

interface CategoryChipProps {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  selected = false,
  onPress,
  showCount = false,
  size = 'medium'
}) => {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getSizeStyles(),
        {
          backgroundColor: selected ? category.color : 'transparent',
          borderColor: category.color,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <MaterialCommunityIcons
        name={category.icon as any}
        size={size === 'small' ? 14 : 16}
        color={selected ? '#FFFFFF' : category.color}
      />
      <Text
        style={[
          styles.text,
          {
            color: selected ? '#FFFFFF' : category.color,
            fontSize: size === 'small' ? 12 : 14,
          },
        ]}
        numberOfLines={1}
      >
        {category.name}
        {showCount && category.taskCount > 0 && ` (${category.taskCount})`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    margin: 2,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    fontWeight: '600',
  },
});