// src/hooks/useFormValidation.ts
// Hook para validação de formulários - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { validateEmail, validateCPF, validatePhone, validatePassword, validateName, validateWeight, validateHeight, validateAge, ValidationResult } from '../utils/validation';

interface FieldValidation {
  value: any;
  rules: Array<(value: any) => ValidationResult>;
}

interface UseFormValidationOptions {
  initialValues: Record<string, any>;
  validationRules: Record<string, Array<(value: any) => ValidationResult>>;
  onSubmit?: (values: Record<string, any>) => Promise<void>;
}

interface UseFormValidationResult {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  setValue: (field: string, value: any) => void;
  setTouched: (field: string) => void;
  validateField: (field: string) => ValidationResult;
  validateAll: () => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
  getFieldProps: (field: string) => {
    value: any;
    onChangeText: (value: any) => void;
    onBlur: () => void;
    error?: string;
  };
}

export function useFormValidation({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormValidationOptions): UseFormValidationResult {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouchedState] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: string): ValidationResult => {
    const fieldRules = validationRules[field];
    if (!fieldRules) return { valid: true };

    const value = values[field];
    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.valid) {
        return result;
      }
    }
    return { valid: true };
  }, [values, validationRules]);

  const setValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validar se o campo já foi tocado
    if (touched[field]) {
      const result = validateField(field);
      setErrors(prev => ({
        ...prev,
        [field]: result.valid ? '' : result.error || '',
      }));
    }
  }, [touched, validateField]);

  const setTouched = useCallback((field: string) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
    
    // Validar ao tocar
    const result = validateField(field);
    setErrors(prev => ({
      ...prev,
      [field]: result.valid ? '' : result.error || '',
    }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const field of Object.keys(validationRules)) {
      const result = validateField(field);
      if (!result.valid) {
        newErrors[field] = result.error || '';
        isValid = false;
      }
    }

    setErrors(newErrors);
    setTouchedState(
      Object.keys(validationRules).reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    return isValid;
  }, [validateField, validationRules]);

  const handleSubmit = useCallback(async () => {
    if (!validateAll()) return;
    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback((field: string) => ({
    value: values[field],
    onChangeText: (value: any) => setValue(field, value),
    onBlur: () => setTouched(field),
    error: touched[field] ? errors[field] : undefined,
  }), [values, errors, touched, setValue, setTouched]);

  const isValid = Object.keys(errors).every(key => !errors[key]);

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setTouched,
    validateField,
    validateAll,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

// Validadores pré-definidos
export const validators = {
  required: (fieldName: string) => (value: any): ValidationResult => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { valid: false, error: `${fieldName} é obrigatório` };
    }
    return { valid: true };
  },
  email: (value: string): ValidationResult => validateEmail(value),
  cpf: (value: string): ValidationResult => validateCPF(value),
  phone: (value: string): ValidationResult => validatePhone(value),
  password: (value: string): ValidationResult => validatePassword(value),
  name: (value: string): ValidationResult => validateName(value),
  weight: (value: number | string): ValidationResult => validateWeight(value),
  height: (value: number | string): ValidationResult => validateHeight(value),
  age: (value: number | string): ValidationResult => validateAge(value),
  minLength: (min: number) => (value: string): ValidationResult => {
    if (value.length < min) {
      return { valid: false, error: `Mínimo de ${min} caracteres` };
    }
    return { valid: true };
  },
  maxLength: (max: number) => (value: string): ValidationResult => {
    if (value.length > max) {
      return { valid: false, error: `Máximo de ${max} caracteres` };
    }
    return { valid: true };
  },
  pattern: (regex: RegExp, message: string) => (value: string): ValidationResult => {
    if (!regex.test(value)) {
      return { valid: false, error: message };
    }
    return { valid: true };
  },
};

export default useFormValidation;
