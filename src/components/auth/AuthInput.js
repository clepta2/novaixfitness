// src/components/auth/AuthInput.js
// Input de autenticação - NOVAIX FITNESS — com animação de foco premium

import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

function AuthInput({ label, placeholder, value, onChangeText, icon, secureTextEntry, keyboardType, autoCapitalize, error }) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const borderColor = error ? COLORS.error : focused ? COLORS.primary : COLORS.border;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.wrapper, { borderColor }]}>
        {icon && (
          <Ionicons
            name={icon}
            size={ICON_SIZES.sm}
            color={focused ? COLORS.primary : COLORS.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eye}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={ICON_SIZES.sm} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

export default memo(AuthInput);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(11),
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(56),
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
  },
  icon: { marginLeft: SPACING.md, marginRight: SPACING.xs },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.md,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: scale(15),
  },
  eye: { paddingHorizontal: SPACING.md, height: '100%', justifyContent: 'center' },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: scale(12),
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
