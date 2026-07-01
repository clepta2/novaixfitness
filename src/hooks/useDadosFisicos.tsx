// src/hooks/useDadosFisicos.ts
// Hook para formulário de dados físicos - NOVAIX FITNESS

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

interface GenderOption {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const GENDERS: GenderOption[] = [
  { id: 'male', label: 'Masculino', icon: 'male', color: COLORS.purple },
  { id: 'female', label: 'Feminino', icon: 'female', color: COLORS.pink },
];

export function isDateValid(ds: string): boolean {
  if (ds.length !== 10) return false;
  const [d, m, y] = ds.split('/').map(Number);
  if (!d || !m || !y || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const ml = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)) ml[1] = 29;
  if (d > ml[m - 1]) return false;
  const cy = new Date().getFullYear();
  return y >= 1920 && y <= cy - 10;
}

export function useDadosFisicos() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [gender, setGender] = useState<string | null>((onboarding?.gender as string) || null);
  const [dob, setDob] = useState((onboarding?.birth_date as string) || '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [weight, setWeight] = useState((onboarding?.weight as number) || 70);
  const [height, setHeight] = useState((onboarding?.height as number) || 170);
  const [state, setState] = useState((onboarding?.state as string) || '');
  const [city, setCity] = useState((onboarding?.city as string) || '');
  const [cep, setCep] = useState((onboarding?.cep as string) || '');
  const [street, setStreet] = useState((onboarding?.street as string) || '');
  const [neighborhood, setNeighborhood] = useState((onboarding?.neighborhood as string) || '');
  const [number, setNumber] = useState((onboarding?.number as string) || '');
  const [nearTo, setNearTo] = useState((onboarding?.near_to as string) || '');

  const dobValid = isDateValid(dob);
  const canProceed = !!gender && dobValid;

  const handleNext = async () => {
    if (!canProceed) return;
    const [d, m, y] = dob.split('/').map(Number);
    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() < m - 1 || (today.getMonth() === m - 1 && today.getDate() < d)) age--;
    await saveOnboarding({ ...onboarding, gender, birth_date: dob, age, weight, height, state, city, cep, street, neighborhood, number, near_to: nearTo });
    await updateProfile({ current_step: 'onboarding' });
    router.push('/onboarding/modelo');
  };

  return {
    gender, setGender, dob, setDob, showCalendar, setShowCalendar,
    weight, setWeight, height, setHeight,
    state, setState, city, setCity, cep, setCep,
    street, setStreet, neighborhood, setNeighborhood,
    number, setNumber, nearTo, setNearTo,
    dobValid, canProceed, handleNext,
  };
}
