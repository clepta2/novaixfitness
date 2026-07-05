import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { getReferralData, shareReferral } from '../../services/referral';

function InviteFriends() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user?.id) getReferralData(user.id).then(setData);
  }, [user?.id]);

  const handleCopy = async () => {
    if (!data?.referral_code) return;
    try {
      const Clipboard = require('expo-clipboard');
      await Clipboard.setStringAsync(data.referral_code);
      Alert.alert('Copiado!', 'Código copiado.');
    } catch {
      Alert.alert('Código', data.referral_code);
    }
  };

  if (!data) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="people-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Convide Amigos</Text>
      </View>
      <View style={styles.codeRow}>
        <Text style={styles.code}>{data.referral_code}</Text>
        <TouchableOpacity onPress={handleCopy} accessibilityLabel="Copiar código">
          <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{data.successful_referrals || 0}</Text>
          <Text style={styles.statLabel}>Convites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{data.bonus_days || 0}</Text>
          <Text style={styles.statLabel}>Dias bônus</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.shareBtn} onPress={() => shareReferral(user?.id)}>
        <Ionicons name="share-outline" size={18} color={COLORS.background} />
        <Text style={styles.shareBtnText}>COMPARTILHAR</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(InviteFriends);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary + '30' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  code: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary, letterSpacing: 2 },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 20, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  shareBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
});
