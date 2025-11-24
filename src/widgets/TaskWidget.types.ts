export interface WidgetTask {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface WidgetProps {
  tasks: WidgetTask[];
  totalTasks: number;
  completedTasks: number;
  onTaskToggle?: (taskId: string) => void;
  onAddTask?: () => void;
}