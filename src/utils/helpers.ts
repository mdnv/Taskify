import { Task } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterTasks = (tasks: Task[], filter: 'all' | 'active' | 'completed'): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.isCompleted);
    case 'completed':
      return tasks.filter(task => task.isCompleted);
    default:
      return tasks;
  }
};

export const sortTasks = (tasks: Task[], sortBy: 'priority' | 'date' = 'date'): Task[] => {
  return tasks.sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Default sorting by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};