// src/constants/colors.tsx
// Design System de cores - re-exportacao

export type { ThemeColors } from './colorsTypes';
export { darkTheme, lightTheme } from './colorsThemes';
import type { ThemeColors } from './colorsTypes';
import { darkTheme, lightTheme } from './colorsThemes';

export const THEMES = { dark: darkTheme, light: lightTheme };
export const COLORS: ThemeColors = { ...darkTheme };

export function setThemeColors(theme: 'dark' | 'light') {
  const source = theme === 'dark' ? darkTheme : lightTheme;
  (Object.keys(source) as Array<keyof ThemeColors>).forEach(key => {
    (COLORS as any)[key] = source[key];
  });
}
