import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import useOfflineStatus from '../../hooks/useOfflineStatus';

export default function OfflineIndicator() {
  const { isOffline, syncing } = useOfflineStatus();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isOffline || syncing ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOffline, syncing]);

  if (!isOffline && !syncing) return null;

  const bgColor = isOffline ? COLORS.attention + '20' : COLORS.success + '20';
  const icon = isOffline ? 'cloud-offline' : 'sync';
  const text = isOffline ? 'Sem conexão' : 'Sincronizando...';

  return (
    <Animated.View style={[styles.banner, { backgroundColor: bgColor, opacity }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Ionicons name={icon} size={14} color={isOffline ? COLORS.attention : COLORS.success} />
      <Text style={[styles.text, { color: isOffline ? COLORS.attention : COLORS.success }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, gap: SPACING.xs,
  },
  text: { fontFamily: 'Montserrat_500Medium', fontSize: 11 },
});
