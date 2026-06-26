// src/components/ui/Input.js
// Componente de Input NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export function Input({ label, value, onChangeText, placeholder, error, icon, secureTextEntry, keyboardType, autoCapitalize, style }) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focused, error && styles.error]}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.textMuted} style={styles.icon} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focused: {
    borderColor: COLORS.primary,
  },
  error: {
    borderColor: COLORS.error,
  },
  icon: {
    marginLeft: SPACING.md,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.md,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: SPACING.md,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
