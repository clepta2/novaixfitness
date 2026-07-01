// src/utils/accessibility.js
// Utilitários de acessibilidade - NOVAIX FITNESS

import { Platform, AccessibilityInfo } from 'react-native';

// Minimum touch target size (44x44 points per WCAG)
export const MIN_TOUCH_TARGET = 44;

// Check if screen reader is enabled
export async function isScreenReaderEnabled() {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch {
    return false;
  }
}

// Check if reduce motion is enabled
export async function isReduceMotionEnabled() {
  try {
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
}

// Announce to screen reader
export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

// Set accessibility focus
export function setAccessibilityFocus(reactTag: number): void {
  AccessibilityInfo.setAccessibilityFocus(reactTag);
}

// Generate accessibility props for interactive elements
export function getAccessibilityProps(label: string, role: string, state: Record<string, boolean> = {}) {
  return {
    accessibilityLabel: label,
    accessibilityRole: role,
    accessibilityState: state,
  };
}

// Common accessibility roles
export const ROLES = {
  BUTTON: 'button',
  LINK: 'link',
  HEADER: 'header',
  IMAGE: 'image',
  TEXT: 'text',
  SEARCH: 'search',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',
  SLIDER: 'slider',
  PROGRESSBAR: 'progressbar',
  TIMER: 'timer',
  ALERT: 'alert',
};

// Common accessibility states
export function getState({ disabled, selected, checked, expanded, busy }: {
  disabled?: boolean;
  selected?: boolean;
  checked?: boolean;
  expanded?: boolean;
  busy?: boolean;
} = {}) {
  const state: Record<string, boolean> = {};
  if (disabled !== undefined) state.disabled = disabled;
  if (selected !== undefined) state.selected = selected;
  if (checked !== undefined) state.checked = checked;
  if (expanded !== undefined) state.expanded = expanded;
  if (busy !== undefined) state.busy = busy;
  return state;
}

// Ensure minimum touch target size
export function ensureTouchTarget(style: Record<string, number> = {}) {
  const minWidth = MIN_TOUCH_TARGET;
  const minHeight = MIN_TOUCH_TARGET;
  
  return {
    ...style,
    minWidth: Math.max(style?.minWidth || 0, minWidth),
    minHeight: Math.max(style?.minHeight || 0, minHeight),
  };
}

// Generate hint text for complex interactions
export function getHint(action: string, result?: string) {
  if (result) {
    return `${action}. ${result}`;
  }
  return action;
}

// Color contrast checker (WCAG AA requires 4.5:1 for normal text)
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hex.replace('#', '').match(/.{2}/g)!.map(x => {
      const val = parseInt(x, 16) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if color combination meets WCAG AA
export function meetsWCAG_AA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5;
}

// Check if color combination meets WCAG AAA
export function meetsWCAG_AAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 7;
}
