// src/utils/a11yHelpers.ts
// Helpers de acessibilidade: contraste WCAG, touch targets, labels - NOVAIX FITNESS

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return 0;
  const [r, g, b] = [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function meetsWCAG_AA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

export function suggestAccessibleColor(background: string): string {
  const lum = getRelativeLuminance(background);
  return lum > 0.5 ? '#12161A' : '#FFFFFF';
}

export const TOUCH_TARGETS = { minSize: 44, recommendedSize: 48 } as const;

export function meetsTouchTarget(width: number, height: number): boolean {
  return width >= TOUCH_TARGETS.minSize && height >= TOUCH_TARGETS.minSize;
}

export function getButtonA11yProps(options: { label: string; disabled?: boolean; loading?: boolean }) {
  return {
    accessibilityLabel: options.label,
    accessibilityRole: 'button' as const,
    accessibilityState: { disabled: options.disabled || false, busy: options.loading || false },
  };
}

export function getInputA11yProps(options: { label: string; error?: string; required?: boolean }) {
  return {
    accessibilityLabel: options.label,
    accessibilityRequired: options.required || false,
    accessibilityInvalid: !!options.error,
    accessibilityHint: options.error || undefined,
  };
}
