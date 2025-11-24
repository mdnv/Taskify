import { create } from 'zustand';
import { Category } from '../types';
import { Storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  // Actions
  loadCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'taskCount'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  updateTaskCount: (categoryId: string, change: number) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,

  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await Storage.getItem<Category[]>('categories');
      if (categories) {
        set({ categories });
      } else {
        // Create default categories
        const defaultCategories: Category[] = [
          {
            id: 'personal',
            name: 'Personal',
            color: '#10B981',
            icon: 'account',
            taskCount: 0
          },
          {
            id: 'work',
            name: 'Work',
            color: '#3B82F6',
            icon: 'briefcase',
            taskCount: 0
          },
          {
            id: 'shopping',
            name: 'Shopping',
            color: '#8B5CF6',
            icon: 'cart',
            taskCount: 0
          },
          {
            id: 'health',
            name: 'Health',
            color: '#EF4444',
            icon: 'heart',
            taskCount: 0
          }
        ];
        set({ categories: defaultCategories });
        Storage.setItem('categories', defaultCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: (categoryData) => {
    const newCategory: Category = {
      id: generateId(),
      ...categoryData,
      taskCount: 0,
    };

    set((state) => {
      const newCategories = [...state.categories, newCategory];
      Storage.setItem('categories', newCategories);
      return { categories: newCategories };
    });
  },

  updateCategory: (id, updates) => {
    set((state) => {
      const newCategories = state.categories.map(category =>
        category.id === id ? { ...category, ...updates } : category
      );
      Storage.setItem('categories', newCategories);
      return { categories: newCategories };
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const newCategories = state.categories.filter(category => category.id !== id);
      Storage.setItem('categories', newCategories);
      return { categories: newCategories };
    });
  },

  getCategoryById: (id) => {
    return get().categories.find(category => category.id === id);
  },

  updateTaskCount: (categoryId, change) => {
    set((state) => {
      const newCategories = state.categories.map(category =>
        category.id === categoryId
          ? { ...category, taskCount: Math.max(0, category.taskCount + change) }
          : category
      );
      Storage.setItem('categories', newCategories);
      return { categories: newCategories };
    });
  },
}));