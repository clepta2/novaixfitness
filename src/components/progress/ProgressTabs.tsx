import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TABS = [
  { key: 'overview', icon: 'stats-chart', label: 'Visão Geral' },
  { key: 'measurements', icon: 'body', label: 'Medidas' },
  { key: 'photos', icon: 'camera', label: 'Fotos' },
  { key: 'weekly', icon: 'calendar', label: 'Semanal' },
];

interface ProgressTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProgressTabs({ activeTab, onTabChange }: ProgressTabsProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          onPress={() => onTabChange(tab.key)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? COLORS.primary : COLORS.textMuted}
          />
          <Text style={[styles.label, activeTab === tab.key && styles.labelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: 2,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '15',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
  },
  labelActive: {
    color: COLORS.primary,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
