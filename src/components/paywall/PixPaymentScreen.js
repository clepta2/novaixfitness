import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { Button } from '../ui/Button';
import { layout, typography } from '../../styles';

export default function PixPaymentScreen({ pixData, onBack, onCopyPix, onCheckPayment, loading }) {
  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          <Text style={typography.h5}>Voltar</Text>
        </TouchableOpacity>
        <View style={layout.section}>
          <Text style={typography.h3}>PAGUE COM PIX</Text>
          <Text style={typography.bodyMuted}>Copie o código e pague no app do banco</Text>
        </View>
        <View style={styles.pixPayload}>
          <Text style={typography.label}>CÓDIGO PIX</Text>
          <TouchableOpacity style={styles.pixCode} onPress={onCopyPix}>
            <Text style={[typography.bodySmall, styles.pixText]} numberOfLines={3}>{pixData.payload}</Text>
            <Ionicons name="copy" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.copyBtn} onPress={onCopyPix}>
          <Ionicons name="copy-outline" size={20} color={COLORS.background} />
          <Text style={typography.button}>COPIAR CÓDIGO PIX</Text>
        </TouchableOpacity>
        <View style={styles.timerBox}>
          <Ionicons name="time-outline" size={20} color={COLORS.attention} />
          <Text style={[typography.bodySmall, { color: COLORS.attention }]}>Expira em 30 minutos</Text>
        </View>
        <View style={{ height: 20 }} />
        <Button title="JÁ PAGUEI" onPress={onCheckPayment} loading={loading} icon="checkmark-circle-outline" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xl },
  pixPayload: { marginBottom: SPACING.xl },
  pixCode: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.sm },
  pixText: { flex: 1, marginRight: SPACING.sm, fontFamily: 'monospace' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.md, marginBottom: SPACING.xl },
  timerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.attention + '15', borderRadius: 8, padding: SPACING.md },
});
