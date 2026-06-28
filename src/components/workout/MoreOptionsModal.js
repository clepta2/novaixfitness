// src/components/workout/MoreOptionsModal.js
// Modal de mais opções - NOVAIX FITNESS

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const OPTIONS = [
  { key: 'add', icon: 'calendar', color: COLORS.primary, label: 'Adicionar à Rotina', desc: 'Incluir nos seus treinos' },
  { key: 'save', icon: 'download', color: COLORS.success, label: 'Salvar Offline', desc: 'Acessar sem internet' },
  { key: 'share', icon: 'share-social', color: COLORS.purple, label: 'Compartilhar', desc: 'Enviar para amigos' },
  { key: 'rate', icon: 'star', color: COLORS.attention, label: 'Avaliar Treino', desc: 'Dê sua nota' },
  { key: 'report', icon: 'flag', color: COLORS.error, label: 'Reportar Problema', desc: 'Reportar conteúdo inadequado' },
];

function OptionItem({ option, index, onPress }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 30, friction: 8, delay: index * 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={styles.option} onPress={() => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
        onPress(option.key);
      }}>
        <View style={[styles.icon, { backgroundColor: option.color + '15' }]}>
          <Ionicons name={option.icon} size={20} color={option.color} />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          <Text style={styles.optionDesc}>{option.desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function MoreOptionsModal({ visible, onSelect, onClose }) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, tension: 30, friction: 8, useNativeDriver: true }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Mais Opções</Text>
            <Text style={styles.subtitle}>O que deseja fazer?</Text>
          </View>

          <View style={styles.optionsList}>
            {OPTIONS.map((opt, i) => (
              <OptionItem key={opt.key} option={opt} index={i} onPress={onSelect} />
            ))}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

export default MoreOptionsModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  header: { marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  optionsList: { marginBottom: SPACING.md },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  icon: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  optionInfo: { flex: 1 },
  optionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  optionDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  cancelBtn: { alignItems: 'center', paddingVertical: SPACING.md },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: COLORS.textMuted },
});
