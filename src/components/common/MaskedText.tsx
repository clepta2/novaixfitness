// src/components/common/MaskedText.tsx
// Componente para exibir texto com mascaramento de PII

import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { maskCPF, maskEmail, maskPhone, maskName, maskCreditCard } from '../../utils/piiMask';

interface MaskedTextProps {
  value: string;
  type: 'cpf' | 'email' | 'phone' | 'name' | 'card';
  showToggle?: boolean;
  style?: object;
  maskedStyle?: object;
}

export function MaskedText({
  value,
  type,
  showToggle = true,
  style,
  maskedStyle,
}: MaskedTextProps) {
  const [isMasked, setIsMasked] = useState(true);

  const getMaskedValue = (val: string, t: string): string => {
    switch (t) {
      case 'cpf': return maskCPF(val);
      case 'email': return maskEmail(val);
      case 'phone': return maskPhone(val);
      case 'name': return maskName(val);
      case 'card': return maskCreditCard(val);
      default: return val;
    }
  };

  const displayValue = isMasked ? getMaskedValue(value, type) : value;

  if (!showToggle) {
    return (
      <Text style={[styles.text, style, isMasked && maskedStyle]}>
        {displayValue}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, style, isMasked && maskedStyle]}>
        {displayValue}
      </Text>
      <TouchableOpacity
        onPress={() => setIsMasked(!isMasked)}
        style={styles.toggle}
        accessibilityLabel={isMasked ? 'Mostrar dados' : 'Ocultar dados'}
        accessibilityRole="button"
      >
        <Ionicons
          name={isMasked ? 'eye-outline' : 'eye-off-outline'}
          size={16}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  toggle: {
    padding: 4,
  },
});