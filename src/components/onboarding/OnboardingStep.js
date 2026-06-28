// src/components/onboarding/OnboardingStep.js
// Componente principal - DATA DRIVEN

import { useState, useCallback } from 'react';
import InfoStep from './InfoStep';
import SingleSelectStep from './SingleSelectStep';
import MultiSectionStep from './MultiSectionStep';
import CepStep from './CepStep';
import InjuryStep from './InjuryStep';
import TogglesStep from './TogglesStep';
import SummaryStep from './SummaryStep';

export default function OnboardingStep({ step, data, onUpdate, onNext }) {
  const [localData, setLocalData] = useState(data || {});

  const handleUpdate = useCallback((field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate?.(newData);
  }, [localData, onUpdate]);

  if (step.type === 'redirect') {
    onNext?.();
    return null;
  }

  switch (step.type) {
    case 'info':
      return <InfoStep step={step} onNext={onNext} />;
    case 'single_select':
      return <SingleSelectStep step={step} value={localData[step.field]} onSelect={(v) => handleUpdate(step.field, v)} />;
    case 'multi_section':
      return <MultiSectionStep step={step} data={localData} onUpdate={handleUpdate} />;
    case 'cep_auto':
      return <CepStep step={step} data={localData} onUpdate={handleUpdate} />;
    case 'injury_flow':
      return <InjuryStep step={step} data={localData} onUpdate={handleUpdate} />;
    case 'toggles':
      return <TogglesStep step={step} data={localData} onUpdate={handleUpdate} />;
    case 'summary':
      return <SummaryStep step={step} data={localData} />;
    default:
      return null;
  }
}
