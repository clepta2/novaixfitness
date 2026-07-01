// src/hooks/useDisponibilidade.ts
// Hook de disponibilidade de treino - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useDisponibilidade() {
  const router = useRouter();
  const { saveOnboarding, onboarding, updateProfile } = useAuth();
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleNext = useCallback(async () => {
    if (!selectedDays || !selectedLocation) return;
    await saveOnboarding({ ...onboarding, daysPerWeek: selectedDays, location: selectedLocation });
    await updateProfile({ current_step: 'onboarding' });
    router.push(selectedLocation === 'gym' ? '/onboarding/tipo-academia' : '/onboarding/experiencia');
  }, [selectedDays, selectedLocation, onboarding, saveOnboarding, updateProfile, router]);

  return {
    selectedDays, setSelectedDays,
    selectedLocation, setSelectedLocation,
    canProceed: !!selectedDays && !!selectedLocation,
    handleNext,
  };
}
