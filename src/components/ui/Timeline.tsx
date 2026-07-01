// src/components/ui/Timeline.tsx
// Timeline vertical para historico - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  time: string;
  icon?: string;
  iconColor?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

interface TimelineProps {
  items: TimelineItem[];
  showConnector?: boolean;
}

export default function Timeline({ items, showConnector = true }: TimelineProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemWrapper}>
          {/* Linha conectora */}
          {showConnector && index < items.length - 1 && (
            <View style={styles.connector} />
          )}

          {/* Icone */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: (item.iconColor || getTypeColor(item.type)) + '20' },
          ]}>
            <Ionicons
              name={(item.icon || getTypeIcon(item.type)) as any}
              size={18}
              color={item.iconColor || getTypeColor(item.type)}
            />
          </View>

          {/* Conteudo */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// Timeline com dados de treino
interface WorkoutTimelineItem {
  id: string;
  workoutName: string;
  date: string;
  duration: number;
  calories: number;
  exercises: number;
  completed: boolean;
}

export function WorkoutTimeline({ items }: { items: WorkoutTimelineItem[] }) {
  return (
    <Timeline
      items={items.map(item => ({
        id: item.id,
        title: item.workoutName,
        subtitle: `${item.exercises} exercicios · ${item.duration}min · ${item.calories}cal`,
        time: item.date,
        icon: item.completed ? 'checkmark-circle' : 'time',
        type: item.completed ? 'success' : 'info',
      }))}
    />
  );
}

// Timeline com conquistas
interface AchievementTimelineItem {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  xp: number;
  icon: string;
}

export function AchievementTimeline({ items }: { items: AchievementTimelineItem[] }) {
  return (
    <Timeline
      items={items.map(item => ({
        id: item.id,
        title: item.name,
        subtitle: `+${item.xp} XP`,
        description: item.description,
        time: item.unlockedAt,
        icon: item.icon,
        iconColor: COLORS.primary,
      }))}
    />
  );
}

function getTypeColor(type?: string): string {
  switch (type) {
    case 'success': return COLORS.success;
    case 'warning': return COLORS.attention;
    case 'error': return COLORS.error;
    default: return COLORS.info;
  }
}

function getTypeIcon(type?: string): string {
  switch (type) {
    case 'success': return 'checkmark-circle';
    case 'warning': return 'warning';
    case 'error': return 'alert-circle';
    default: return 'information-circle';
  }
}

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.sm },
  itemWrapper: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    left: 15,
    top: 36,
    bottom: -SPACING.md,
    width: 2,
    backgroundColor: COLORS.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    zIndex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    flex: 1,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textDescription,
    lineHeight: 18,
  },
});
