// src/components/activity/ActivityStarter.tsx
// Componente reutilizável para iniciar/finalizar atividades

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface ActivityType {
  id: string;
  label: string;
  icon: string;
}

const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'running', label: 'CORRIDA', icon: 'walk' },
  { id: 'cycling', label: 'CICLISMO', icon: 'bicycle' },
  { id: 'walking', label: 'CAMINHADA', icon: 'footsteps' },
  { id: 'hiking', label: 'TRILHA', icon: 'map' },
];

interface ActivityStarterProps {
  activeActivity: string | null;
  onStart: (type: string) => void;
  onFinish: () => void;
}

export default function ActivityStarter({ activeActivity, onStart, onFinish }: ActivityStarterProps) {
  if (activeActivity) {
    return (
      <TouchableOpacity style={styles.stopBtn} onPress={onFinish}>
        <Ionicons name="stop-circle" size={20} color={COLORS.error} />
        <Text style={[styles.btnText, { color: COLORS.error }]}>FINALIZAR ATIVIDADE</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.row}>
      {ACTIVITY_TYPES.map((type) => (
        <TouchableOpacity key={type.id} style={styles.btn} onPress={() => onStart(type.id)}>
          <Ionicons name={type.icon as any} size={20} color={COLORS.primary} />
          <Text style={styles.btnText}>{type.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  btn: {
    flex: 1, minWidth: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.xs, padding: SPACING.md, backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  btnText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textTitle },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, padding: SPACING.lg, backgroundColor: COLORS.error + '10',
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.error,
  },
});
