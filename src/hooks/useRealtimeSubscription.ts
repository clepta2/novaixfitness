// src/hooks/useRealtimeSubscription.ts
// Hook para subscriptions em tempo real com Supabase - NOVAIX FITNESS

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeSubscriptionOptions {
  table: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  enabled?: boolean;
}

interface UseRealtimeSubscriptionResult<T> {
  data: T[];
  isConnected: boolean;
  error: Error | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

export function useRealtimeSubscription<T extends { id: string }>({
  table,
  filter,
  event = '*',
  enabled = true,
}: UseRealtimeSubscriptionOptions): UseRealtimeSubscriptionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const subscribe = useCallback(() => {
    if (!enabled || channelRef.current) return;

    try {
      const channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes' as any,
          {
            event,
            schema: 'public',
            table,
            filter,
          },
          (payload: any) => {
            const newItem = payload.new as T;
            const oldItem = payload.old as T;

            setData(prev => {
              switch (event) {
                case 'INSERT':
                  return [...prev, newItem];
                case 'UPDATE':
                  return prev.map(item =>
                    item.id === newItem.id ? newItem : item
                  );
                case 'DELETE':
                  return prev.filter(item => item.id !== oldItem.id);
                default:
                  // Para evento '*', processar baseado no tipo
                  if (payload.eventType === 'INSERT') {
                    return [...prev, newItem];
                  } else if (payload.eventType === 'UPDATE') {
                    return prev.map(item =>
                      item.id === newItem.id ? newItem : item
                    );
                  } else if (payload.eventType === 'DELETE') {
                    return prev.filter(item => item.id !== oldItem.id);
                  }
                  return prev;
              }
            });
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
          if (status === 'CHANNEL_ERROR') {
            setError(new Error('Erro na conexão em tempo real'));
          }
        });

      channelRef.current = channel;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [table, filter, event, enabled]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Conectar ao montar
  useEffect(() => {
    if (enabled) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [enabled, subscribe, unsubscribe]);

  // Reconectar em caso de erro
  useEffect(() => {
    if (error && enabled) {
      const timer = setTimeout(() => {
        setError(null);
        subscribe();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, enabled, subscribe]);

  return {
    data,
    isConnected,
    error,
    subscribe,
    unsubscribe,
  };
}

export default useRealtimeSubscription;
