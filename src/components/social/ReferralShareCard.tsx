// src/components/social/ReferralShareCard.js
// Card compartilhável de referral com código

import { View, Text, TouchableOpacity, Share, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ReferralShareCard({ referralCode, referralCount = 0, onCopy }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Junte-se a mim no NOVAIX Fitness! Use meu código ${referralCode} e ganhe 30 dias grátis! 💪\nhttps://novaixfitness.com/ref/${referralCode}`,
      });
    } catch (err) {
      if (__DEV__) console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="gift" size={24} color={COLORS.primary} />
        <Text style={styles.title}>CONVITE EXCLUSIVO</Text>
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.code}>{referralCode}</Text>
      </View>

      <Text style={styles.description}>
        Compartilhe e ganhe <Text style={styles.highlight}>+30 dias grátis</Text> para cada amigo que assinar!
      </Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{referralCount}</Text>
          <Text style={styles.statLabel}>Convites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>+{referralCount * 30}</Text>
          <Text style={styles.statLabel}>Dias Bônus</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.copyBtn} onPress={onCopy}>
          <Ionicons name="copy-outline" size={18} color={COLORS.primary} />
          <Text style={styles.copyText}>Copiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color={COLORS.background} />
          <Text style={styles.shareText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  codeContainer: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  code: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.primary, letterSpacing: 2 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.xl },
  highlight: { color: COLORS.primary, fontFamily: 'Montserrat_700Bold' },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl, marginBottom: SPACING.xl },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  statDivider: { width: 1, height: 40, backgroundColor: COLORS.border },
  actions: { flexDirection: 'row', gap: SPACING.md },
  copyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.primary },
  copyText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.primary },
  shareBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.primary },
  shareText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.background },
});
