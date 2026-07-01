// src/components/auth/SocialButton.js
// Botão social (Google/Apple) - NOVAIX FITNESS — visual premium

import { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

function SocialButton({ icon, iconColor, label, onPress, bgColor, translucent }) {
  const buttonBg = translucent ? 'rgba(30, 35, 42, 0.55)' : bgColor || COLORS.surface;
  const borderColor = translucent ? 'rgba(255, 255, 255, 0.12)' : COLORS.border;
  const textColor = COLORS.textTitle;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonBg, borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={ICON_SIZES.md} color={iconColor} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default memo(SocialButton);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    height: scale(54),
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: scale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(14),
    color: COLORS.textTitle,
    letterSpacing: 0.5,
  },
});
