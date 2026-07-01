// src/helpers/password.ts
// Validação de força de senha - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

const WEAK_PASSWORDS = [
  '123456', '12345678', '123456789', 'password', 'senha123', 'novaix123', 'qwerty',
];

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { strength: 0, label: '', color: COLORS.error };
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const isWeak = WEAK_PASSWORDS.includes(password.toLowerCase());
  const fs = isWeak ? Math.max(1, score - 2) : score;

  return {
    strength: fs,
    label: fs <= 1 ? 'Senha Fraca 🔴' : fs <= 3 ? 'Senha Média 🟡' : 'Senha Forte 🔥',
    color: fs <= 1 ? COLORS.errorLight : fs <= 3 ? COLORS.warning : COLORS.primary,
  };
}
