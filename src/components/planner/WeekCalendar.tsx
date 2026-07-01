// src/components/planner/WeekCalendar.tsx
// Calendário semanal horizontal - NOVAIX FITNESS

import { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { DAY_KEYS, DAY_NAMES_SHORT } from '../../data/weekPlan';
import DayWorkoutSlot from './DayWorkoutSlot';

interface DayData {
  isRest?: boolean;
  category?: string;
  workoutName?: string;
  duration?: number;
  workoutId?: string;
}

interface WeekPlan {
  [key: string]: DayData | null;
}

interface WeekCalendarProps {
  weekPlan: WeekPlan | null;
  onDayPress?: (key: string, data: DayData | null) => void;
}

function getWeekDates(refDate: Date): Array<{ key: string; date: Date }> {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);

  return DAY_KEYS.map((key, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return { key, date };
  });
}

export default function WeekCalendar({ weekPlan, onDayPress }: WeekCalendarProps): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const todayKey = DAY_KEYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const [weekDates] = useState(() => getWeekDates(new Date()));

  useEffect(() => {
    if (scrollRef.current) {
      const idx = DAY_KEYS.indexOf(todayKey);
      scrollRef.current.scrollTo({ x: Math.max(0, idx * 72 - 140), animated: false });
    }
  }, [todayKey]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {weekDates.map(({ key, date }) => (
        <DayWorkoutSlot
          key={key}
          dayName={DAY_NAMES_SHORT[DAY_KEYS.indexOf(key)]}
          dateNumber={date.getDate()}
          dayData={weekPlan?.[key] || null}
          isToday={key === todayKey}
          onPress={(data) => onDayPress?.(key, data)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
});
