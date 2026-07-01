// @ts-nocheck
// src/components/auth/PasswordStrength.js
import { View, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { styles } from '../../styles/registerStyles';

export default function PasswordStrength({ strength, label, color, password, isDark }) {
  const rules = [
    ['Mínimo 8 caracteres', password.length >= 8],
    ['Maiúscula (A-Z)', /[A-Z]/.test(password)],
    ['Minúscula (a-z)', /[a-z]/.test(password)],
    ['Número (0-9)', /[0-9]/.test(password)],
    ['Símbolo (@, #, !)', /[^A-Za-z0-9]/.test(password)],
  ];

  return (
    <View style={[styles.strengthWrap, { marginBottom: SPACING.md }]}>
      <View style={styles.strengthBarBg}>
        <View style={[styles.strengthBarFill, { width: `${(strength / 5) * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.strengthText, { color, marginBottom: 6 }]}>{label}</Text>
      <View style={{ gap: 2 }}>
        {rules.map(([lbl, ok]) => (
          <Text
            key={lbl}
            style={{
              fontSize: 11,
              color: ok ? COLORS.primary : (isDark ? 'rgba(255,255,255,0.4)' : COLORS.textMuted),
            }}
          >
            {ok ? '✓' : '○'} {lbl}
          </Text>
        ))}
      </View>
    </View>
  );
}
