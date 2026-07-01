// src/types/common.ts - Utilitarios e tipos base

export type WithTimestamps<T> = T & { created_at: string; updated_at: string };
export type PaginatedResponse<T> = { data: T[]; page: number; limit: number; total: number; hasMore: boolean };
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: { message: string; code?: string } };
