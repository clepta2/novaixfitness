import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

export default function BillingToggle({ billingType, onToggle }) {
  return (
    <View style={styles.billingToggle}>
      <Text style={typography.label}>FORMA DE PAGAMENTO</Text>
      <View style={styles.billingOptions}>
        <TouchableOpacity style={[styles.billingOption, billingType === 'PIX' && styles.billingActive]} onPress={() => onToggle('PIX')}>
          <Ionicons name="wallet" size={20} color={billingType === 'PIX' ? COLORS.background : COLORS.textMuted} />
          <Text style={[typography.bodySmall, billingType === 'PIX' && styles.billingTextActive]}>PIX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.billingOption, billingType === 'CREDIT_CARD' && styles.billingActive]} onPress={() => onToggle('CREDIT_CARD')}>
          <Ionicons name="card" size={20} color={billingType === 'CREDIT_CARD' ? COLORS.background : COLORS.textMuted} />
          <Text style={[typography.bodySmall, billingType === 'CREDIT_CARD' && styles.billingTextActive]}>Cartão</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  billingToggle: { marginTop: SPACING.xl },
  billingOptions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  billingOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  billingActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  billingTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
});
