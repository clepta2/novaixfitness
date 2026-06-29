import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, THEMES, setThemeColors } from '../constants/colors';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { updateWebStyles } from '../components/common/WebStyles';

const ThemeContext = createContext({
  colors: COLORS,
  isDark: true,
  themeMode: 'dark',
  setThemeMode: () => {},
});

export function ThemeProvider({ children }) {
  const { user, profile } = useAuth();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('dark');
  const [colors, setColors] = useState({ ...COLORS });

  const resolvedTheme = useMemo(() => {
    if (themeMode === 'system') return systemScheme || 'dark';
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

  const setThemeMode = useCallback(async (mode) => {
    setThemeModeState(mode);
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ app_settings: { ...profile?.app_settings, themeMode: mode, darkMode: mode === 'dark' } })
        .eq('id', user.id);
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

export function useTheme() {
  return useContext(ThemeContext);
}
