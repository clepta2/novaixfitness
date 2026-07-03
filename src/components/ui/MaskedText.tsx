// src/components/ui/MaskedText.tsx
// Componente para mascaramento automático de PII - NOVAIX FITNESS

import React from 'react';
import { Text, TextProps } from 'react-native';
import { maskCPF, maskEmail, maskPhone, maskName } from '../../utils/piiMask';

interface MaskedTextProps extends TextProps {
  value: string;
  type: 'cpf' | 'email' | 'phone' | 'name' | 'auto';
  children?: never;
}

/**
 * Componente que automaticamente mascara dados pessoais (PII)
 */
export function MaskedText({ value, type, style, ...props }: MaskedTextProps): React.JSX.Element {
  const getMaskedValue = (): string => {
    if (!value) return '';

    switch (type) {
      case 'cpf':
        return maskCPF(value);
      case 'email':
        return maskEmail(value);
      case 'phone':
        return maskPhone(value);
      case 'name':
        return maskName(value);
      case 'auto':
        return autoDetectAndMask(value);
      default:
        return value;
    }
  };

  return (
    <Text style={style} {...props}>
      {getMaskedValue()}
    </Text>
  );
}

function autoDetectAndMask(value: string): string {
  // CPF: 11 dígitos
  if (/^\d{11}$/.test(value.replace(/\D/g, ''))) {
    return maskCPF(value);
  }

  // Email
  if (value.includes('@')) {
    return maskEmail(value);
  }

  // Phone: 10-11 dígitos
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 11) {
    return maskPhone(value);
  }

  // Nome próprio (detecção básica)
  if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(value)) {
    return maskName(value);
  }

  return value;
}

export default MaskedText;
