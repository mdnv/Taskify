# Taskify Widget System

## Overview
Taskify now includes a beautiful, animated widget system for the Android home screen and in-app widget preview.

## Features

### 🎨 HomeWidget Component
Located in `src/widgets/HomeWidget.tsx`, this component provides:

- **Beautiful UI Design**
  - Gradient backgrounds and smooth colors
  - Large, clear task statistics with circular badges
  - Progress bar with animated fill
  - Responsive layout

- **Interactive Elements**
  - Tap tasks to mark them as complete
  - View more tasks link
  - Open app button with smooth animations
  - Quick stats display

- **Animations**
  - Fade-in on load
  - Scale animations on button presses
  - Smooth opacity transitions
  - Bounce effect on task completion

### 🎯 SimpleWidget Component
Located in `src/widgets/SimpleWidget.tsx`, for lighter weight displays:

- Task list preview
- Completion statistics
- Priority indicators with colors
- Add task button

### 📱 In-App Widget Preview
The HomeScreen (`src/screens/HomeScreen.tsx`) displays the HomeWidget for quick task management without navigation.

## Widget Data Synchronization

The `widgetService` (`src/utils/widgetService.ts`) handles:

- **Data Storage**: Widget data is stored in AsyncStorage
- **Updates**: Automatically syncs when tasks change
- **Listeners**: Real-time updates through subscription system
- **Actions**: Handles widget interactions (ADD_TASK, TOGGLE_TASK, OPEN_APP)

## Usage

### In React Components

```tsx
import { HomeWidget } from '@/widgets';
import { useTaskStore } from '@/store/useTaskStore';

export const MyComponent = () => {
  const { tasks } = useTaskStore();

  return (
    <HomeWidget
      tasks={tasks}
      onToggleTask={(taskId) => {
        // Handle task toggle
      }}
      onOpenApp={() => {
        // Handle app open
      }}
    />
  );
};
```

## Animations

Reusable animation components are available in `src/components/animations/AnimatedComponents.tsx`:

- **AnimatedContainer**: Fade-in, slide-up, or scale animations
- **PulseAnimation**: Continuous pulsing effect
- **BouncyButton**: Spring-based button animations
- **FadeInOut**: Conditional fade animations

### Example

```tsx
import { AnimatedContainer } from '@/components/animations/AnimatedComponents';

<AnimatedContainer type="slideUp" delay={100}>
  <TaskItem task={task} />
</AnimatedContainer>
```

## Android Home Screen Widget (Future)

To enable native Android home screen widget support:

1. Install native widget library (when ready)
2. The widget service is already prepared with AsyncStorage data sync
3. Widget data is automatically updated in `@TaskifyWidget:data` key

## Colors Used

- **Primary**: #6366F1 (Indigo)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)
- **Surface**: #F8FAFC (Light)
- **Text**: #1E293B (Dark Slate)
- **Secondary Text**: #94A3B8 (Slate)

## Performance Optimizations

- Animated values use `useNativeDriver: true` for smooth 60fps animations
- Widget data is cached in AsyncStorage for quick access
- Subscriptions are cleaned up to prevent memory leaks
- Conditional rendering for empty states

## Testing

To test the widget:

1. Start the app: `npm start` or `expo start`
2. Navigate to HomeScreen
3. The HomeWidget preview is displayed at the top
4. Interact with tasks directly in the widget
5. Check that animation effects are smooth and responsive

## Troubleshooting

- **Widget not updating**: Check that `widgetService.updateWidget()` is called after task changes
- **Animations stuttering**: Ensure `useNativeDriver: true` is set for Animated components
- **Data not persisting**: Verify AsyncStorage permissions in app.json
