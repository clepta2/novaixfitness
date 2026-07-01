// src/components/settings/SettingsGroup.js
// Grupo de configurações animado - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function SettingsItem({ item, value, onToggle, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleToggle = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    onToggle(item.key);
  };

  return (
    <Animated.View style={[styles.item, { opacity: fadeAnim, transform: [{ translateX }] }]}>
      <View style={styles.left}>
        <View style={[styles.icon, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>{item.label}</Text>
          {item.desc && <Text style={styles.desc}>{item.desc}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{ false: COLORS.surfaceOverlay, true: COLORS.primary }}
        thumbColor={value ? COLORS.background : COLORS.textMuted}
      />
    </Animated.View>
  );
}

export default function SettingsGroup({ title, items, settings, onToggle }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <SettingsItem key={item.key} item={item} value={settings[item.key]} onToggle={onToggle} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});
