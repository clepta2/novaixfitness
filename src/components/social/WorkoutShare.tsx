// src/components/social/WorkoutShare.js
// Compartilhar conclusão de treino - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default memo(function WorkoutShare({ workout, xp, duration, exercises, onShare }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = async () => {
    const message = `💪 Treino concluído no NOVAIX Fitness!\n\n` +
      `🏋️ ${workout?.name || 'Treino'}\n` +
      `⏱️ ${duration || '30'} min\n` +
      `🎯 ${exercises || 0} exercícios\n` +
      `⭐ +${xp || 0} XP\n\n` +
      `Baixe o NOVAIX Fitness e treine comigo!`;

    try {
      await Share.share({ message });
      onShare?.();
    } catch (err) {
      if (__DEV__) console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
        </View>
        <Text style={styles.title}>TREINO CONCLUÍDO!</Text>
        <Text style={styles.subtitle}>Parabéns! Você arrasou!</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>+{xp || 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="time" size={20} color={COLORS.info} />
          <Text style={styles.statValue}>{duration || '30'}</Text>
          <Text style={styles.statLabel}>min</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="barbell" size={20} color={COLORS.success} />
          <Text style={styles.statValue}>{exercises || 0}</Text>
          <Text style={styles.statLabel}>exercícios</Text>
        </View>
      </View>

      <View style={styles.shareSection}>
        <Text style={styles.shareTitle}>Compartilhe sua conquista!</Text>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color={COLORS.background} />
          <Text style={styles.shareText}>COMPARTILHAR</Text>
        </TouchableOpacity>

        <View style={styles.shareOptions}>
          <TouchableOpacity style={styles.shareOption} onPress={() => Share.share({ message: `Treinei com NOVAIX Fitness! ${workout?.name || 'Treino'} - ${duration || 0}min` })}>
            <Ionicons name="logo-whatsapp" size={24} color={COLORS.whatsapp} />
            <Text style={styles.shareOptionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareOption} onPress={() => Share.share({ message: `Treinei com NOVAIX Fitness! ${workout?.name || 'Treino'} - ${duration || 0}min` })}>
            <Ionicons name="logo-instagram" size={24} color={COLORS.pink} />
            <Text style={styles.shareOptionText}>Instagram</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareOption} onPress={() => Share.share({ message: `Treinei com NOVAIX Fitness! ${workout?.name || 'Treino'} - ${duration || 0}min` })}>
            <Ionicons name="copy" size={24} color={COLORS.primary} />
            <Text style={styles.shareOptionText}>Copiar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.success + '40' },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  iconContainer: { marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.success, letterSpacing: 1, marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  statsGrid: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.xl },
  statItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  shareSection: { alignItems: 'center' },
  shareTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: BORDER_RADIUS.md, width: '100%', marginBottom: SPACING.md },
  shareText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
  shareOptions: { flexDirection: 'row', gap: SPACING.xl },
  shareOption: { alignItems: 'center', gap: SPACING.xs },
  shareOptionText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
