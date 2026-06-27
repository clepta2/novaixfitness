import { View, Text, Switch, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const CONSENTS = [
  { key: 'marketing', label: 'Marketing', desc: 'E-mails promocionais e novidades' },
  { key: 'analytics', label: 'Análise de Uso', desc: 'Dados anônimos para melhorar o app' },
  { key: 'thirdParty', label: 'Terceiros', desc: 'Compartilhar com parceiros analíticos' },
];

export default function ConsentToggles({ values, onChange, loading }) {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>CONSENTIMENTOS</Text>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ padding: SPACING.xl }} />
      ) : (
        CONSENTS.map((c) => (
          <View key={c.key} style={styles.item}>
            <View style={styles.info}>
              <Text style={typography.h5}>{c.label}</Text>
              <Text style={typography.caption}>{c.desc}</Text>
            </View>
            <Switch
              value={values[c.key]}
              onValueChange={(v) => onChange(c.key, v)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={values[c.key] ? COLORS.background : COLORS.textMuted}
            />
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  info: { flex: 1, marginRight: SPACING.md },
});
