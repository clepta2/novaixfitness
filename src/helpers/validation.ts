// src/helpers/validation.ts
// Auxiliares de validação de formulários - NOVAIX FITNESS

import { ALLOWED_DOMAINS } from '../data/allowedDomains';

export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,}(\s+[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,})+$/.test(name.trim());
};

export const validateEmailFormat = (email: string): boolean => {
  return email.trim().length > 0 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

export const validateEmailDomain = (email: string): boolean => {
  return ALLOWED_DOMAINS.includes(email.trim().split('@')[1]?.toLowerCase());
};
