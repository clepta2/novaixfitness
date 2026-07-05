// src/components/referral/ReferralCard.js
// Card de referral/convite - NOVAIX FITNESS

import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { getReferralData, shareReferral } from '../../services/referral';
import { typography } from '../../styles';

function ReferralCard() {
  const { user } = useAuth();
  const [referralData, setReferralData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        const data = await getReferralData(user.id);
        setReferralData(data);
      }
    };
    load();
  }, [user?.id]);

  const handleShare = () => shareReferral(user?.id);

  const handleCopy = async () => {
    if (referralData?.referral_code) {
      try {
        const Clipboard = require('expo-clipboard');
        await Clipboard.setStringAsync(referralData.referral_code);
        if (Platform.OS === 'web') {
          alert('Código de indicação copiado!');
        } else {
          Alert.alert('Copiado!', 'Código de indicação copiado para a área de transferência.');
        }
      } catch (err) {
        if (Platform.OS === 'web') {
          alert(`Código: ${referralData.referral_code}`);
        } else {
          Alert.alert('Código', referralData.referral_code);
        }
      }
    }
  };

  if (!referralData) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="gift-outline" size={24} color={COLORS.primary} />
        <Text style={typography.h5}>Indique e Ganhe</Text>
      </View>

      <Text style={typography.bodyMuted}>
        Convide amigos e ganhe 30 dias grátis para cada amigo que assinar!
      </Text>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Seu código:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{referralData.referral_code}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{referralData.successful_referrals}</Text>
          <Text style={styles.statLabel}>Convites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{referralData.bonus_days}</Text>
          <Text style={styles.statLabel}>Dias bônus</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Ionicons name="share-outline" size={20} color={COLORS.background} />
        <Text style={styles.shareText}>COMPARTILHAR CÓDIGO</Text>
      </TouchableOpacity>
    </View>
  );
}

export default memo(ReferralCard);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary + '30' },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  codeContainer: { marginVertical: SPACING.xl },
  codeLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },
  codeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  code: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.primary, letterSpacing: 2 },
  copyBtn: { padding: SPACING.sm },
  stats: { flexDirection: 'row', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.primary },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md },
  shareText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
