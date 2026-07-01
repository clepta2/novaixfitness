import { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface SyncButtonProps {
  onSync: () => void;
  syncing: boolean;
  lastSync?: string | null;
}

export default function SyncButton({ onSync, syncing, lastSync }: SyncButtonProps): React.JSX.Element {
  const spinAnim = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect((): void => {
    if (syncing) {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [syncing]);

  const rotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const formatTime = (iso: string): string | null => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onSync}
      disabled={syncing}
      accessibilityLabel={syncing ? 'Sincronizando' : 'Sincronizar agora'}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <Ionicons name="sync" size={16} color={COLORS.primary} />
      </Animated.View>
      <Text style={styles.label}>{syncing ? 'Sincronizando...' : 'Sincronizar'}</Text>
      {lastSync && !syncing && (
        <Text style={styles.time}>{formatTime(lastSync)}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.primary,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
});
