// src/components/profile/LevelUpModal.js
// Modal de celebração de level up - NOVAIX FITNESS

import { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';
import { Button } from '../ui/Button';

export default function LevelUpModal({ visible, level, onClose }) {
  const [scaleAnim] = useState(() => new Animated.Value(0.8));
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [iconBounce] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 3, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(iconBounce, { toValue: -10, duration: 400, useNativeDriver: true }),
          Animated.timing(iconBounce, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible || !level) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconCircle, { backgroundColor: (level.color || COLORS.primary) + '20' }]}>
            <Animated.View style={{ transform: [{ translateY: iconBounce }] }}>
              <Ionicons name={level.icon || 'trophy'} size={48} color={level.color || COLORS.primary} />
            </Animated.View>
          </View>

          <Text style={styles.congrats}>PARABÉNS!</Text>
          <Text style={styles.title}>VOCÊ SUBIU DE NÍVEL</Text>

          <View style={[styles.levelBadge, { backgroundColor: level.color || COLORS.primary }]}>
            <Text style={styles.levelText}>{level.level}</Text>
          </View>

          <Text style={styles.levelName}>{level.name}</Text>
          <Text style={styles.description}>{level.perks || 'Continue treinando para desbloquear mais benefícios!'}</Text>

          <Button title="CONTINUAR" onPress={onClose} style={styles.button} />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  content: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxl, alignItems: 'center', width: '100%', maxWidth: 340 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  congrats: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary, letterSpacing: 2 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.sm },
  levelBadge: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginVertical: SPACING.lg },
  levelText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.background },
  levelName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.xl },
  button: { width: '100%' },
});
