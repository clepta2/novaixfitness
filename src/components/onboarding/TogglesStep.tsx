// src/components/onboarding/TogglesStep.tsx
// Step de toggles (notificações)
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { ViewStyle, TextStyle } from 'react-native';

interface Channel {
  id: string;
  icon: string;
  label: string;
}

interface Step {
  title: string;
  subtitle: string;
  channels: Channel[];
  note?: string;
}

interface TogglesStepProps {
  step: Step;
  data: { notification_channels?: string[] };
  onUpdate: (key: string, value: string[]) => void;
}

export default function TogglesStep({ step, data, onUpdate }: TogglesStepProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.subtitle}>{step.subtitle}</Text>
      <Text style={styles.sectionLabel}>CANAIS</Text>
      {step.channels.map((channel) => (
        <TouchableOpacity key={channel.id} style={styles.toggleRow} onPress={() => {
          const current = data.notification_channels || [];
          const newValue = current.includes(channel.id) ? current.filter(c => c !== channel.id) : [...current, channel.id];
          onUpdate('notification_channels', newValue);
        }}>
          <Ionicons name={channel.icon as any} size={20} color={COLORS.textMuted} />
          <Text style={styles.toggleLabel}>{channel.label}</Text>
          <View style={[styles.toggle, (data.notification_channels || []).includes(channel.id) && styles.toggleActive]}>
            <View style={[styles.toggleDot, (data.notification_channels || []).includes(channel.id) && styles.toggleDotActive]} />
          </View>
        </TouchableOpacity>
      ))}
      {step.note && <Text style={styles.note}>{step.note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  toggleLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: COLORS.textTitle },
  toggle: { width: 51, height: 31, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', paddingHorizontal: 2 },
  toggleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleDot: { width: 27, height: 27, borderRadius: 13, backgroundColor: COLORS.textMuted },
  toggleDotActive: { backgroundColor: COLORS.background, alignSelf: 'flex-end' },
  note: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.lg, textAlign: 'center' },
});
