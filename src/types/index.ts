export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  categoryId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  reminder?: Date;
  notificationId?: string;
  overdueNotificationSent?: boolean;
}


export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  taskCount: number;
}

export interface FilterOptions {
  status: 'all' | 'active' | 'completed';
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  searchQuery?: string;
  showOverdue?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  defaultPriority: 'low' | 'medium' | 'high';
  sortBy: 'created' | 'dueDate' | 'priority' | 'manual';
}

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  tasksByCategory: Array<{
    categoryId: string;
    count: number;
    completed: number;
  }>;
  weeklyCompletion: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  tasks: Task[];
  categories: Category[];
  settings: AppSettings;
}