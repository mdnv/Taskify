import { create } from 'zustand';
import { Task, FilterOptions } from '../types';
import { Storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { useCategoryStore } from './useCategoryStore';

interface TaskStore {
  tasks: Task[];
  filters: FilterOptions;
  isLoading: boolean;
  searchQuery: string;
  // Actions
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'order'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleCompletion: (id: string) => void;
  setFilter: (filter: Partial<FilterOptions>) => void;
  setSearchQuery: (query: string) => void;
  getFilteredTasks: () => Task[];
  clearCompleted: () => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getOverdueTasks: () => Task[];
  // Phase 3 Actions
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  moveTaskToPosition: (taskId: string, newPosition: number) => void;
  getAnalyticsData: () => AnalyticsData;
  exportData: () => BackupData;
  importData: (data: BackupData) => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filters: { status: 'all' },
  isLoading: false,
  searchQuery: '',

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const tasks = await Storage.getItem<Task[]>('tasks');
      if (tasks) {
        set({ 
          tasks: tasks.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            reminder: task.reminder ? new Date(task.reminder) : undefined
          }))
        });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: (taskData) => {
    const { tasks } = get();
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: tasks.length, // New tasks at the end
    };

    set((state) => {
      const newTasks = [...state.tasks, newTask];
      Storage.setItem('tasks', newTasks);
      
      if (taskData.categoryId) {
        const { updateTaskCount } = useCategoryStore.getState();
        updateTaskCount(taskData.categoryId, 1);
      }
      
      return { tasks: newTasks };
    });
  },

  updateTask: (id, updates) => {
    set((state) => {
      const oldTask = state.tasks.find(task => task.id === id);
      const newTasks = state.tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      );
      Storage.setItem('tasks', newTasks);

      if (oldTask && updates.categoryId !== undefined && oldTask.categoryId !== updates.categoryId) {
        const { updateTaskCount } = useCategoryStore.getState();
        if (oldTask.categoryId) {
          updateTaskCount(oldTask.categoryId, -1);
        }
        if (updates.categoryId) {
          updateTaskCount(updates.categoryId, 1);
        }
      }
      
      return { tasks: newTasks };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const taskToDelete = state.tasks.find(task => task.id === id);
      const newTasks = state.tasks.filter(task => task.id !== id);
      Storage.setItem('tasks', newTasks);

      if (taskToDelete?.categoryId) {
        const { updateTaskCount } = useCategoryStore.getState();
        updateTaskCount(taskToDelete.categoryId, -1);
      }
      
      return { tasks: newTasks };
    });
  },

  toggleCompletion: (id) => {
    set((state) => {
      const newTasks = state.tasks.map(task =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
          : task
      );
      Storage.setItem('tasks', newTasks);
      return { tasks: newTasks };
    });
  },

  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter }
    }));
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredTasks: () => {
    const { tasks, filters, searchQuery } = get();
    const { settings } = useSettingsStore.getState();
    
    let filtered = tasks.filter(task => {
      if (filters.status === 'active' && task.isCompleted) return false;
      if (filters.status === 'completed' && !task.isCompleted) return false;
      if (filters.category && task.categoryId !== filters.category) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription) return false;
      }
      
      if (filters.showOverdue) {
        const now = new Date();
        if (!task.dueDate || task.dueDate > now || task.isCompleted) return false;
      }
      
      return true;
    });
    
    // Sort based on settings
    switch (settings.sortBy) {
      case 'dueDate':
        return filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return b.order - a.order;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return filtered.sort((a, b) => {
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          return priorityDiff !== 0 ? priorityDiff : b.order - a.order;
        });
      case 'manual':
        return filtered.sort((a, b) => b.order - a.order);
      default: // 'created'
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  clearCompleted: () => {
    set((state) => {
      const completedTasks = state.tasks.filter(task => task.isCompleted);
      const newTasks = state.tasks.filter(task => !task.isCompleted);
      Storage.setItem('tasks', newTasks);

      completedTasks.forEach(task => {
        if (task.categoryId) {
          const { updateTaskCount } = useCategoryStore.getState();
          updateTaskCount(task.categoryId, -1);
        }
      });
      
      return { tasks: newTasks };
    });
  },

  getTasksByCategory: (categoryId) => {
    const { tasks } = get();
    return tasks.filter(task => task.categoryId === categoryId);
  },

  getOverdueTasks: () => {
    const { tasks } = get();
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      task.dueDate < now && 
      !task.isCompleted
    );
  },

  // Phase 3: Drag & Drop
  reorderTasks: (fromIndex, toIndex) => {
    set((state) => {
      const newTasks = [...state.tasks];
      const [movedTask] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, movedTask);
      
      // Update order based on new positions
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        order: newTasks.length - index - 1
      }));
      
      Storage.setItem('tasks', updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  moveTaskToPosition: (taskId, newPosition) => {
    set((state) => {
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return state;
      
      const newTasks = [...state.tasks];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      newTasks.splice(newPosition, 0, movedTask);
      
      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        order: newTasks.length - index - 1
      }));
      
      Storage.setItem('tasks', updatedTasks);
      return { tasks: updatedTasks };
    });
  },

  // Phase 3: Analytics
  getAnalyticsData: () => {
    const { tasks } = get();
    const { categories } = useCategoryStore.getState();
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Weekly completion data
    const weeklyCompletion = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = tasks.filter(task => 
        task.isCompleted && 
        task.updatedAt.toDateString() === date.toDateString()
      ).length;
      
      const created = tasks.filter(task => 
        task.createdAt.toDateString() === date.toDateString()
      ).length;
      
      weeklyCompletion.push({ date: dateStr, completed, created });
    }

    // Average completion time
    const completedTasks = tasks.filter(task => task.isCompleted);
    const totalCompletionTime = completedTasks.reduce((total, task) => {
      return total + (task.updatedAt.getTime() - task.createdAt.getTime());
    }, 0);
    const averageCompletionTime = completedTasks.length > 0 
      ? totalCompletionTime / completedTasks.length 
      : 0;

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      averageCompletionTime,
      tasksByPriority: {
        high: tasks.filter(task => task.priority === 'high').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        low: tasks.filter(task => task.priority === 'low').length,
      },
      tasksByCategory: categories.map(category => ({
        categoryId: category.id,
        count: tasks.filter(task => task.categoryId === category.id).length,
        completed: tasks.filter(task => task.categoryId === category.id && task.isCompleted).length,
      })),
      weeklyCompletion,
    };
  },

  // Phase 3: Backup/Restore
  exportData: () => {
    const { tasks } = get();
    const { categories } = useCategoryStore.getState();
    const { settings } = useSettingsStore.getState();
    
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
      settings,
    };
  },

  importData: (data: BackupData) => {
    set(() => {
      const { updateTaskCount } = useCategoryStore.getState();
      const { updateSettings } = useSettingsStore.getState();
      
      // Update categories first
      useCategoryStore.setState({ categories: data.categories });
      Storage.setItem('categories', data.categories);
      
      // Update tasks
      const tasksWithDates = data.tasks.map(task => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        reminder: task.reminder ? new Date(task.reminder) : undefined
      }));
      
      Storage.setItem('tasks', tasksWithDates);
      
      // Update settings
      updateSettings(data.settings);
      
      return { tasks: tasksWithDates };
    });
  },
}));

// Add missing import
import { useSettingsStore } from './useSettingsStore';
import { AnalyticsData, BackupData } from '../types';