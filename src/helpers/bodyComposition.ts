// src/helpers/bodyComposition.ts
// Cálculos de composição corporal - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface BMIResult {
  value: string;
  category: string;
  color: string;
}

interface BodyFatResult {
  value: string;
  formula: string;
}

type ActivityLevel = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';

export function calculateBMI(weight: number, height: number): BMIResult | null {
  if (!weight || !height) return null;
  const bmi = weight / ((height / 100) ** 2);
  let category: string, color: string;
  if (bmi < 18.5) { category = 'Abaixo do peso'; color = COLORS.info; }
  else if (bmi < 25) { category = 'Peso normal'; color = COLORS.success; }
  else if (bmi < 30) { category = 'Sobrepeso'; color = COLORS.attention; }
  else { category = 'Obesidade'; color = COLORS.error; }
  return { value: bmi.toFixed(1), category, color };
}

export function calculateBodyFat(
  weight: number,
  height: number,
  age: number,
  gender: 'M' | 'F',
  waist: number,
  neck: number,
  hip?: number
): BodyFatResult | null {
  if (!weight || !height || !age || !waist || !neck) return null;

  if (gender === 'M') {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    return { value: Math.max(3, Math.min(40, bf)).toFixed(1), formula: 'US Navy' };
  } else {
    if (!hip) return null;
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    return { value: Math.max(10, Math.min(50, bf)).toFixed(1), formula: 'US Navy' };
  }
}

export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: 'M' | 'F',
  activity: ActivityLevel
): number {
  let bmr: number;
  if (gender === 'M') bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  else bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  const multipliers: Record<ActivityLevel, number> = { 
    sedentario: 1.2, 
    leve: 1.375, 
    moderado: 1.55, 
    intenso: 1.725, 
    muito_intenso: 1.9 
  };
  return Math.round(bmr * (multipliers[activity] || 1.55));
}
