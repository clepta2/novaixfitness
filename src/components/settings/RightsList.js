import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

const RIGHTS = [
  { icon: 'eye-outline', text: 'Acesso aos dados pessoais' },
  { icon: 'create-outline', text: 'Correção de dados incorretos' },
  { icon: 'download-outline', text: 'Portabilidade dos dados' },
  { icon: 'trash-outline', text: 'Eliminação dos dados pessoais' },
  { icon: 'close-circle-outline', text: 'Revogação do consentimento' },
  { icon: 'information-circle-outline', text: 'Informação sobre compartilhamento' },
];

export default function RightsList() {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>SEUS DIREITOS (LGPD Art. 18)</Text>
      {RIGHTS.map((item, i) => (
        <View key={i} style={styles.item}>
          <Ionicons name={item.icon} size={18} color={COLORS.primary} />
          <Text style={typography.bodySmall}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm },
});
