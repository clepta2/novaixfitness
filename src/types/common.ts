// src/types/common.ts - Utilitarios e tipos base

export type WithTimestamps<T> = T & { created_at: string; updated_at: string };
export type PaginatedResponse<T> = { data: T[]; page: number; limit: number; total: number; hasMore: boolean };
export type ApiResponse<T> = { ok: boolean; data?: T; error?: string };

export type SelectOption = {
  id: string; label: string; icon?: string; description?: string; color?: string;
};

export type NavigationRoute = {
  name: string; params?: Record<string, any>;
};
