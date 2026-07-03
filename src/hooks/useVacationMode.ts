// Vacation mode hook - pause streaks and notifications
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { tryIf } from '../utils/tryIf';

const VACATION_KEY = '@novaix:vacation_mode';

interface VacationMode {
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
}

export function useVacationMode() {
  const { user } = useAuth();
  const [vacation, setVacation] = useState<VacationMode>({ enabled: false, startDate: null, endDate: null });

  useEffect(() => {
    loadVacation();
  }, [user?.id]);

  const loadVacation = async () => {
    // Carregar do Supabase primeiro (fonte de verdade)
    if (user?.id) {
      const supaResult = await tryIf(async () => {
        const { data } = await supabase.from('profiles')
          .select('vacation_mode').eq('id', user.id).single();
        return data;
      }, { retries: 1, baseDelay: 500 });
      if (supaResult.ok && supaResult.data?.vacation_mode) {
        setVacation(supaResult.data.vacation_mode);
        await AsyncStorage.setItem(VACATION_KEY, JSON.stringify(supaResult.data.vacation_mode));
        return;
      }
    }
    // Fallback para AsyncStorage
    const localResult = await tryIf(async () => {
      const raw = await AsyncStorage.getItem(VACATION_KEY);
      if (raw) setVacation(JSON.parse(raw));
    }, { retries: 1, baseDelay: 500 });
  };

  const enableVacation = useCallback(async (days: number = 7) => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + days);
    const mode: VacationMode = {
      enabled: true,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
    };
    setVacation(mode);
    await AsyncStorage.setItem(VACATION_KEY, JSON.stringify(mode));
    // Sincronizar com Supabase
    if (user?.id) {
      await tryIf(async () => {
        await supabase.from('profiles').update({ vacation_mode: mode }).eq('id', user.id);
      }, { retries: 1, baseDelay: 500 });
    }
  }, [user?.id]);

  const disableVacation = useCallback(async () => {
    const mode: VacationMode = { enabled: false, startDate: null, endDate: null };
    setVacation(mode);
    await AsyncStorage.removeItem(VACATION_KEY);
    // Sincronizar com Supabase
    if (user?.id) {
      await tryIf(async () => {
        await supabase.from('profiles').update({ vacation_mode: mode }).eq('id', user.id);
      }, { retries: 1, baseDelay: 500 });
    }
  }, [user?.id]);

  return { ...vacation, enableVacation, disableVacation };
}
