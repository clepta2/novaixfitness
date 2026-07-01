// src/components/planner/WeekCalendar.js
// Calendário semanal horizontal - NOVAIX FITNESS

import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { DAY_KEYS, DAY_NAMES_SHORT } from '../../data/weekPlan';
import DayWorkoutSlot from './DayWorkoutSlot';

function getWeekDates(refDate: any) {
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

export default function WeekCalendar({ weekPlan, onDayPress }) {
  const scrollRef = useRef(null);
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
