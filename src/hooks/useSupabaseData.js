// src/hooks/useSupabaseData.js
// Hook com fallback para dados mock - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export function useSupabaseData(tableName, options = {}) {
  const { select = '*', filters = [], orderBy = null, limit = null, mockData = [] } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const filtersKey = JSON.stringify(filters);
  const orderByKey = JSON.stringify(orderBy);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Testar conexão
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
      setError(err.message);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, [tableName, select, filtersKey, orderByKey, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (record) => {
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
      return { error: err.message };
    }
  };

  const update = async (id, updates) => {
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
      return { error: err.message };
    }
  };

  const remove = async (id) => {
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
      return { error: err.message };
    }
  };

  return { data, loading, error, isConnected, refetch: fetchData, insert, update, remove };
}
