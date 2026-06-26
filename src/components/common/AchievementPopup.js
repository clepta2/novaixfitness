// src/components/common/AchievementPopup.js
// Popup de conquista desbloqueada - NOVAIX FITNESS

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function AchievementPopup({ achievement, visible, onDone }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible && achievement) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(2500),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.5, duration: 200, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
      ]).start(() => onDone?.());
    }
  }, [visible, achievement]);

  if (!achievement) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.icon, { backgroundColor: achievement.color + '20' }]}>
          <Ionicons name={achievement.icon} size={40} color={achievement.color} />
        </View>
        <Text style={styles.title}>CONQUISTA DESBLOQUEADA!</Text>
        <Text style={styles.name}>{achievement.name}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.massive, alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary, width: 280 },
  icon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary, letterSpacing: 2, marginBottom: SPACING.sm },
  name: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.xs },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center' },
});
