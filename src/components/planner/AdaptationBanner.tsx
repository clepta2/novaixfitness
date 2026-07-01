// src/components/planner/AdaptationBanner.js
// Banner de adaptacao automatica do plano - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function AdaptationBanner({ reason, onAdapt, loading }) {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-20))[0];

  useEffect(() => {
    if (reason) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [reason]);

  if (!visible || !reason) return null;

  return (
    <Animated.View style={[styles.banner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.iconWrap}>
        <Ionicons name="sparkles" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Plano pronto para evoluir!</Text>
        <Text style={styles.reason}>{reason}</Text>
      </View>
      <TouchableOpacity style={styles.adaptBtn} onPress={onAdapt} disabled={loading} activeOpacity={0.8}>
        <Text style={styles.adaptBtnText}>{loading ? '...' : 'APTUALIZAR'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30', gap: SPACING.sm },
  iconWrap: { width: 36, height: 36, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  reason: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, marginTop: 2 },
  adaptBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  adaptBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background, letterSpacing: 0.5 },
});
