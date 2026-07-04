// src/components/workout/ExerciseQuickPanel.js
// Painel compacto de ajuda ao exercício com tabs - NOVAIX FITNESS

import React, { useState, useMemo, memo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getFallbackExerciseDetails } from '../../data/exercises';
import ExerciseStepCarousel from './ExerciseStepCarousel';
import VideoPreview from './VideoPreview';

const TABS = [
  { key: 'steps', label: 'Passos', icon: 'list' },
  { key: 'tips', label: 'Dicas', icon: 'bulb' },
  { key: 'errors', label: 'Erros', icon: 'warning' },
  { key: 'video', label: 'Vídeo', icon: 'play-circle' },
];

function CarouselItem({ text, color, icon }: any) {
  return (
    <View style={[styles.carouselItem, { borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={14} color={color} style={{ marginTop: 2 }} />
      <Text style={styles.carouselText}>{text}</Text>
    </View>
  );
}

function CarouselSlider({ items, color, icon }: any) {
  const [idx, setIdx] = useState(0);
  if (!items?.length) return <Text style={styles.empty}>Nenhuma informação disponível.</Text>;
  return (
    <View>
      <CarouselItem text={items[idx]} color={color} icon={icon} />
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={18} color={idx === 0 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.dots}>
          {items.map((_: any, i: number) => (
            <TouchableOpacity key={i} onPress={() => setIdx(i)}>
              <View style={[styles.dot, i === idx && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => setIdx(Math.min(items.length - 1, idx + 1))} disabled={idx === items.length - 1} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-forward" size={18} color={idx === items.length - 1 ? COLORS.border : COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.counter}>{idx + 1} / {items.length}</Text>
      <Text style={styles.counter}>{idx + 1} / {items.length}</Text>
    </View>
  );
}

function ExerciseQuickPanel({ exercise }: any) {
  const [activeTab, setActiveTab] = useState('steps');
  const { steps, tips, mistakes } = useMemo(() => {
    const d = getFallbackExerciseDetails(exercise?.name, exercise?.muscle);
    return {
      steps: exercise?.steps?.length > 0 ? exercise.steps : d.steps,
      tips: exercise?.tips?.length > 0 ? exercise.tips : d.tips,
      mistakes: exercise?.mistakes?.length > 0 ? exercise.mistakes : d.mistakes,
    };
  }, [exercise?.name, exercise?.muscle, exercise?.steps, exercise?.tips, exercise?.mistakes]);

  if (!exercise) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
            <Ionicons name={tab.icon as any} size={13} color={activeTab === tab.key ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'steps' && <ExerciseStepCarousel steps={steps} />}
        {activeTab === 'tips' && <CarouselSlider items={tips} color={COLORS.success} icon="checkmark-circle" />}
        {activeTab === 'errors' && <CarouselSlider items={mistakes} color={COLORS.error} icon="close-circle" />}
        {activeTab === 'video' && (
          <VideoPreview videoId={exercise?.videoId || exercise?.video_id || 'dQw4w9WgXcQ'} showVideo={true} onToggle={() => {}} />
        )}
      </View>
    </View>
  );
}

export default memo(ExerciseQuickPanel);

const styles = StyleSheet.create({
  panel: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.md },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: SPACING.sm },
  tabActive: { backgroundColor: COLORS.primary },
  tabLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 },
  tabLabelActive: { color: COLORS.background },
  content: { padding: SPACING.md },
  carouselItem: { borderLeftWidth: 3, paddingLeft: SPACING.sm, marginBottom: SPACING.sm, flexDirection: 'row', gap: SPACING.xs, alignItems: 'flex-start' },
  carouselText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle, flex: 1, lineHeight: 18 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginTop: SPACING.xs },
  dots: { flexDirection: 'row', gap: SPACING.xs },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.primary, width: 16 },
  counter: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xs },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textAlign: 'center', padding: SPACING.md },
});
