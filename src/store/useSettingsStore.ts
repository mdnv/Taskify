import { create } from 'zustand';
import { AppSettings } from '../types';
import { Storage } from '../utils/storage';

interface SettingsStore {
  settings: AppSettings;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setSortBy: (sortBy: AppSettings['sortBy']) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {
    theme: 'light',
    language: 'en',
    notifications: true,
    defaultPriority: 'medium',
    sortBy: 'created',
  },

  loadSettings: async () => {
    try {
      const settings = await Storage.getItem<AppSettings>('settings');
      if (settings) {
        set({ settings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  updateSettings: (updates) => {
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      Storage.setItem('settings', newSettings);
      return { settings: newSettings };
    });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme: 'light' | 'dark' | 'system' = state.settings.theme === 'light' ? 'dark' : 'light';
      const newSettings: AppSettings = { ...state.settings, theme: newTheme };
      Storage.setItem('settings', newSettings);
      return { settings: newSettings };
    });
  },

  setSortBy: (sortBy) => {
    set((state) => {
      const newSettings = { ...state.settings, sortBy };
      Storage.setItem('settings', newSettings);
      return { settings: newSettings };
    });
  },
}));