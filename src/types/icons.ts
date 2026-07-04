// src/types/icons.ts
// Type-safe wrapper for Ionicons name prop
// Ionicons accepts any valid icon name string — this type allows that

export type IconName = React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];

// Utility: cast a string to IconName for Ionicons
export function icon(name: string): IconName {
  return name as IconName;
}
