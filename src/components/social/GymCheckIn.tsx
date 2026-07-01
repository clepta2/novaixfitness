// src/components/social/GymCheckIn.js
// Botão de check-in na academia

import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useI18n } from '../../i18n';

export default function GymCheckIn({ visible, onClose, onCheckIn, recentCheckIns = [] }) {
  const { t } = useI18n();
  const [gymName, setGymName] = useState('');

  const handleCheckIn = () => {
    if (!gymName.trim()) {
      Alert.alert(t('common.error'), t('gym.enterGymNameError'));
      return;
    }
    onCheckIn?.({ gymName: gymName.trim() });
    setGymName('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>CHECK-IN NA ACADEMIA</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <TextInput
              style={styles.input}
              placeholder="Nome da academia"
              placeholderTextColor={COLORS.textMuted}
              value={gymName}
              onChangeText={setGymName}
            />
          </View>

          <TouchableOpacity style={styles.checkInBtn} onPress={handleCheckIn}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.textTitle} />
            <Text style={styles.checkInText}>Fazer Check-in</Text>
          </TouchableOpacity>

          {recentCheckIns.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Quem está na academia</Text>
              {recentCheckIns.slice(0, 5).map((checkin, i) => (
                <View key={i} style={styles.recentItem}>
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.recentName}>{checkin.name}</Text>
                  <Text style={styles.recentGym}>{checkin.gymName}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: SPACING.xl, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xl },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  checkInBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.full },
  checkInText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  recentSection: { marginTop: SPACING.xl },
  recentTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm },
  recentName: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle, flex: 1 },
  recentGym: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
