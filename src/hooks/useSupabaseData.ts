// src/hooks/useSupabaseData.ts
// Hook com fallback para dados mock - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

interface Filter {
  column: string;
  value: string | number | boolean;
  op?: 'eq' | 'ilike';
}

interface OrderBy {
  column: string;
  ascending?: boolean;
}

interface SupabaseDataOptions {
  select?: string;
  filters?: Filter[];
  orderBy?: OrderBy | null;
  limit?: number | null;
  mockData?: unknown[];
}

export function useSupabaseData(tableName: string, options: SupabaseDataOptions = {}) {
  const { select = '*', filters = [], orderBy = null, limit = null, mockData = [] } = options;
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const filtersKey = JSON.stringify(filters);
  const orderByKey = JSON.stringify(orderBy);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: pingError } = await supabase.from(tableName).select('id').limit(1);

      if (pingError) {
        setIsConnected(false);
        setData(mockData);
        return;
      }

      setIsConnected(true);

      let query = supabase.from(tableName).select(select);

      filters.forEach(({ column, value, op = 'eq' }) => {
        query = op === 'eq' ? query.eq(column, value) : query.ilike(column, `%${value}%`);
      });

      if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      if (limit) query = query.limit(limit);

      const { data: result, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setData(result || []);
    } catch (err) {
      console.error(`Erro ao buscar ${tableName}:`, err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, [tableName, select, filtersKey, orderByKey, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (record: Record<string, unknown>) => {
    if (!isConnected) return { error: 'Sem conexão' };

    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      fetchData();
      return { data: result };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const update = async (id: string, updates: Record<string, unknown>) => {
    if (!isConnected) return { error: 'Sem conexão' };

    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      fetchData();
      return { data: result };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const remove = async (id: string) => {
    if (!isConnected) return { error: 'Sem conexão' };

    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  return { data, loading, error, isConnected, refetch: fetchData, insert, update, remove };
}
