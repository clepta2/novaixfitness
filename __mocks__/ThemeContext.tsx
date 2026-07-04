const React = require('react');

const defaultColors = {
  primary: '#CCFF00',
  background: '#12161A',
  surface: '#1E232A',
  surfaceElevated: '#2A3040',
  textTitle: '#FFFFFF',
  textMuted: '#8892A0',
  textDescription: '#B0B8C4',
  border: '#2A3040',
  error: '#F44336',
  success: '#4CAF50',
  attention: '#FFC107',
  purple: '#9C27B0',
  secondary: '#00D4AA',
  gold: '#FFD700',
  cyan: '#00BCD4',
  errorBg: '#FFEBEE',
  successBg: '#E8F5E9',
};

const ThemeContext = React.createContext({ colors: defaultColors, isDark: true });

function ThemeProvider({ children }) {
  return React.createElement(ThemeContext.Provider, { value: { colors: defaultColors, isDark: true } }, children);
}

function useColors() {
  return defaultColors;
}

function useTheme() {
  return { colors: defaultColors, isDark: true };
}

module.exports = { ThemeProvider, useColors, useTheme, ThemeContext };
