import { Platform } from 'react-native';
import { COLORS } from '../../constants/colors';

export function injectWebStyles(): void {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const existing = document.getElementById('novaix-web-styles');
    if (!existing) {
      const style = document.createElement('style');
      style.id = 'novaix-web-styles';
      style.textContent = getScrollbarCSS();
      document.head.appendChild(style);
    }
  }
}

export function updateWebStyles(): void {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const existing = document.getElementById('novaix-web-styles');
    if (existing) {
      existing.textContent = getScrollbarCSS();
    }
  }
}

function getScrollbarCSS(): string {
  const isDark = COLORS.background === '#12161A';
  const trackBg = isDark ? COLORS.background : '#F1F5F9';
  const thumbBg = isDark ? COLORS.surface : '#CBD5E1';
  const thumbHover = COLORS.primary;

  return `
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: ${trackBg}; }
    ::-webkit-scrollbar-thumb { background: ${thumbBg}; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: ${thumbHover}; }
    * { scrollbar-width: thin; scrollbar-color: ${thumbBg} ${trackBg}; }
  `;
}
