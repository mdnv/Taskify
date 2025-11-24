import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../../store/useSettingsStore';
import { lightTheme, darkTheme } from '../../constants/themes';

interface ThemeContextType {
  isDark: boolean;
  colors: typeof lightTheme | typeof darkTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { settings, loadSettings, toggleTheme } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const isDark = settings.theme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};