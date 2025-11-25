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
import { Text, View } from 'react-native';
import { useTaskStore } from './src/store/useTaskStore';
import { NotificationService } from './src/utils/notifications';
import { widgetService } from './src/utils/widgetService';
import { useWidgetCallHandler, updateWidgetData } from './src/utils/widgetCallHandler';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();


const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors, isDark } = useTheme();
  const { loadCategories } = useCategoryStore();
  const { loadTasks, scheduleTaskReminders, checkAndNotifyOverdueTasks, tasks } = useTaskStore();

  // Инициализировать обработчик событий виджета
  useWidgetCallHandler();

  useEffect(() => {
    const initializeApp = async () => {
      await loadTasks();
      await loadCategories();
      
      // Инициализация уведомлений
      await NotificationService.requestPermissions();
      await scheduleTaskReminders();
      await checkAndNotifyOverdueTasks();
      
      // Инициализация виджета
      if (tasks && tasks.length > 0) {
        await widgetService.initializeWidget(tasks);
      }
      
      // Обновить данные в нативном виджете
      updateWidgetData();
    };

    initializeApp();
  }, []);

  // Обновление виджета при изменении задач
  useEffect(() => {
    if (tasks && tasks.length >= 0) {
      widgetService.updateWidget(tasks);
      updateWidgetData();
    }
  }, [tasks]);

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
          tabBarItemStyle: { marginBottom: 4 },
          title: 'Tasks'
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder" size={size} color={color} />
          ),
          tabBarItemStyle: { marginBottom: 4 },
          title: 'Categories'
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box" size={size} color={color} />
          ),
          tabBarItemStyle: { marginBottom: 4 },
          title: 'Analytics'
        }}
      />
    </Tab.Navigator>
  );
}


// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, textAlign: 'center' }}>
            Something went wrong. Please restart the app.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}


export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Инициализация уведомлений при запуске приложения
        await NotificationService.requestPermissions();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <TabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}