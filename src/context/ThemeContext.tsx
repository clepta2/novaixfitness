// src/context/ThemeContext.tsx
// Context para Temas - NOVAIX FITNESS

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, THEMES, setThemeColors } from '../constants/colors';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { updateWebStyles } from '../components/common/WebStyles';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  colors: typeof COLORS;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: COLORS,
  isDark: true,
  themeMode: 'dark',
  setThemeMode: async () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [colors, setColors] = useState({ ...COLORS });

  const resolvedTheme = useMemo(() => {
    if (themeMode === 'system') return (systemScheme || 'dark') as 'dark' | 'light';
    return themeMode;
  }, [themeMode, systemScheme]);

  useEffect(() => {
    const source = THEMES[resolvedTheme] || THEMES.dark;
    setColors({ ...source });
    setThemeColors(resolvedTheme);
    updateWebStyles();
  }, [resolvedTheme]);

  useEffect(() => {
    if (profile?.app_settings?.themeMode) {
      setThemeModeState(profile.app_settings.themeMode);
    } else if (profile?.app_settings?.darkMode === false) {
      setThemeModeState('light');
    }
  }, [profile?.app_settings]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({ app_settings: { ...profile?.app_settings, themeMode: mode, darkMode: mode === 'dark' } })
          .eq('id', user.id);
      } catch (err) {
        if (__DEV__) console.error('Erro ao salvar tema:', err);
      }
    }
  }, [user?.id, profile?.app_settings]);

  const value = useMemo(() => ({
    colors,
    isDark: resolvedTheme === 'dark',
    themeMode,
    setThemeMode,
  }), [colors, resolvedTheme, themeMode, setThemeMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}

export function useColors() {
  return useContext(ThemeContext).colors;
}
