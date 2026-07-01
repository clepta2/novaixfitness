import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function WaitlistFeature({ feature, isJoined, onJoin, loading }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>{feature.icon}</Text>
        <View style={styles.info}>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.description}>{feature.description}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, isJoined && styles.buttonJoined]}
        onPress={() => onJoin(feature.id)}
        disabled={isJoined || loading}
        activeOpacity={0.8}
        accessibilityLabel={isJoined ? 'Você já está na lista de espera' : `Entrar na lista de espera: ${feature.title}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: isJoined || loading }}
        accessibilityHint={isJoined ? 'Já notificado' : 'Adiciona à lista de espera e notifica quando disponível'}
      >
        <Text style={[styles.buttonText, isJoined && styles.buttonTextJoined]}>
          {isJoined ? 'NOTIFICADO' : 'ENTRAR NA LISTA'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textDescription,
    lineHeight: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonJoined: {
    backgroundColor: COLORS.surfaceOverlay,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.background,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  buttonTextJoined: {
    color: COLORS.textMuted,
  },
});
