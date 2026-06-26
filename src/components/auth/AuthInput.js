// src/components/auth/AuthInput.js
// Input de autenticação - NOVAIX FITNESS

import React, { memo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function AuthInput({ label, placeholder, value, onChangeText, icon, secureTextEntry, keyboardType, autoCapitalize, error }) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.wrapper, focused && styles.focused, error && styles.error]}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.textMuted} style={styles.icon} />}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eye}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default memo(AuthInput);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  wrapper: { flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  focused: { borderColor: COLORS.primary },
  error: { borderColor: COLORS.error },
  icon: { marginLeft: SPACING.md },
  input: { flex: 1, height: '100%', paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16 },
  eye: { paddingHorizontal: SPACING.md },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.error, marginTop: SPACING.xs },
});
