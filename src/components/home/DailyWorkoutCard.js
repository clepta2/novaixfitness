import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TYPE_CONFIG = {
  'HIIT/CALISTENIA': { icon: 'flash', color: COLORS.error },
  'Musculação': { icon: 'primary', color: COLORS.primary },
  'Cardio': { icon: 'heart', color: COLORS.secondary },
  'Yoga': { icon: 'body', color: COLORS.info },
};

export default function DailyWorkoutCard({ workout, onStart, isOfflineCached = false }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const typeConfig = TYPE_CONFIG[workout?.type] || TYPE_CONFIG['HIIT/CALISTENIA'];
  const cardColor = typeConfig.color === 'primary' ? COLORS.primary : typeConfig.color;

  const handleStart = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    onStart?.();
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <ImageBackground
        source={require('../../../assets/images/workout_1.jpg')}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(18,22,26,0.3)', 'rgba(18,22,26,0.9)']}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={[styles.typeBadge, { backgroundColor: 'rgba(0,0,0,0.6)', borderColor: cardColor, borderWidth: 1 }]}>
              <Ionicons name={typeConfig.icon === 'primary' ? 'barbell' : typeConfig.icon} size={14} color={cardColor} />
              <Text style={[styles.typeText, { color: cardColor }]}>{workout?.type || 'Treino'}</Text>
            </View>
            {isOfflineCached && (
              <View style={styles.offlineBadge}>
                <Ionicons name="download" size={10} color={COLORS.primary} />
                <Text style={styles.offlineText}>Offline</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{workout?.name || 'Treino do Dia'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={14} color="#FFFFFF" />
              <Text style={styles.statText}>{workout?.timer || '30:15'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flame" size={14} color={COLORS.secondary} />
              <Text style={styles.statText}>~{Math.round(30 * 8)} kcal</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.startBtn, { backgroundColor: COLORS.primary }]} onPress={handleStart} activeOpacity={0.8}>
            <Ionicons name="play" size={22} color={COLORS.background} />
            <Text style={styles.startText}>INICIAR TREINO</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  bgImage: { width: '100%' },
  gradient: { padding: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full },
  typeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: COLORS.primary + '40' },
  offlineText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: COLORS.primary },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: '#FFFFFF', marginBottom: SPACING.md, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, flex: 1, justifyContent: 'center' },
  statText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: '#FFFFFF' },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)' },
  startBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  startText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
