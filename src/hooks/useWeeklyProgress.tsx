// src/hooks/useWeeklyProgress.ts
// Hook para carregar dados de progresso semanal

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { getDateRange, PERIOD_FILTERS } from '../components';
import { DAY_NAMES, DAY_FULL } from '../data/filters';

interface WorkoutSummary {
  name: string;
  category: string;
  duration: number;
}

interface DayData {
  day: string;
  fullDay: string;
  count: number;
  minutes: number;
  workouts: WorkoutSummary[];
  timestamp?: number;
}

interface WeekData {
  byDay: DayData[];
  totalWorkouts: number;
  totalMinutes: number;
  activeDays: number;
  totalDays: number;
  bestDay: DayData | null;
  categories: Record<string, number>;
  totalXP: number;
  globalWorkouts: number;
  streak: number;
}

export function useWeeklyProgress(userId: string | undefined, period: string) {
  const [weekData, setWeekData] = useState<WeekData | null>(null);

  useEffect(() => {
    async function loadWeekData() {
      if (!userId) return;
      const { start, end } = getDateRange(period);

      const [workoutsRes, profileRes] = await Promise.all([
        supabase.from('user_workouts')
          .select('completed, duration, completed_at, workouts(title, category)')
          .eq('user_id', userId).eq('completed', true)
          .gte('completed_at', start)
          .lte('completed_at', end),
        supabase.from('profiles')
          .select('total_xp, total_workouts, max_streak')
          .eq('id', userId).single(),
      ]);

      const workouts = workoutsRes.data || [];
      const profile: any = profileRes.data || {};

      const filter = PERIOD_FILTERS.find((p: { key: string }) => p.key === period) || PERIOD_FILTERS[1];
      const totalDays = filter.days;

      let byDay: DayData[] = [];
      if (totalDays <= 7) {
        byDay = Array(totalDays).fill(null).map((_, i) => {
          const d = new Date(start);
          d.setDate(d.getDate() + i);
          const dayStart = new Date(d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(d);
          dayEnd.setHours(23, 59, 59, 999);

          const dayWorkouts = workouts.filter((w: { completed_at: string }) => {
            const date = new Date(w.completed_at);
            return date >= dayStart && date <= dayEnd;
          });

          const dayIndex = d.getDay();
          return {
            day: totalDays === 1 ? 'Hoje' : DAY_NAMES[dayIndex],
            fullDay: totalDays === 1 ? 'Hoje' : DAY_FULL[dayIndex],
            count: dayWorkouts.length,
            minutes: dayWorkouts.reduce((s: number, w: { duration?: number }) => s + (w.duration || 0), 0),
            workouts: dayWorkouts.map((w: any) => {
              const workoutItem = Array.isArray(w.workouts) ? w.workouts[0] : w.workouts;
              return {
                name: workoutItem?.title || 'Treino',
                category: workoutItem?.category || '',
                duration: w.duration || 0,
              };
            }),
          };
        });
      } else {
        const dayMap: Record<string, DayData> = {};
        workouts.forEach((w: any) => {
          const workoutItem = Array.isArray(w.workouts) ? w.workouts[0] : w.workouts;
          const dateStr = new Date(w.completed_at).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
          if (!dayMap[dateStr]) {
            dayMap[dateStr] = {
              day: new Date(w.completed_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
              fullDay: dateStr.charAt(0).toUpperCase() + dateStr.slice(1),
              count: 0,
              minutes: 0,
              workouts: [],
              timestamp: new Date(w.completed_at).getTime(),
            };
          }
          dayMap[dateStr].count += 1;
          dayMap[dateStr].minutes += w.duration || 0;
          dayMap[dateStr].workouts.push({
            name: workoutItem?.title || 'Treino',
            category: workoutItem?.category || '',
            duration: w.duration || 0,
          });
        });
        byDay = Object.values(dayMap).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      }

      const categories: Record<string, number> = {};
      workouts.forEach((w: any) => {
        const workoutItem = Array.isArray(w.workouts) ? w.workouts[0] : w.workouts;
        const cat = workoutItem?.category || 'Outro';
        categories[cat] = (categories[cat] || 0) + 1;
      });

      const bestDay = byDay.reduce((best, d) => d.count > best.count ? d : best, byDay[0] || { count: 0 } as DayData);
      const activeDaysSet = new Set(workouts.map((w: { completed_at: string }) => new Date(w.completed_at).toDateString()));

      setWeekData({
        byDay,
        totalWorkouts: workouts.length,
        totalMinutes: workouts.reduce((s: number, w: { duration?: number }) => s + (w.duration || 0), 0),
        activeDays: activeDaysSet.size,
        totalDays,
        bestDay: bestDay.count > 0 ? bestDay : null,
        categories,
        totalXP: profile.total_xp || 0,
        globalWorkouts: profile.total_workouts || 0,
        streak: profile.max_streak || 0,
      });
    }
    loadWeekData();
  }, [userId, period]);

  return weekData;
}
