import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/components/ui/ThemeProvider';
import { HomeScreen } from './src/screens/HomeScreen';
import { CategoriesScreen } from './src/screens/CategoriesScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { useSettingsStore } from './src/store/useSettingsStore';
import { useCategoryStore } from './src/store/useCategoryStore';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, isDark } = useTheme();
  const { loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
          title: 'Tasks',
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <TabNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}