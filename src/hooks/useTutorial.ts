// src/hooks/useTutorial.ts
// Hook para gerenciar tutoriais por tela - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { hasCompletedTutorial, completeTutorial, markTutorialSkipped, getTutorialSteps } from '../services/tutorial';
import { useAuth } from '../context/AuthContext';

export function useTutorial(screenId: string, autoShow = false) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [steps, setSteps] = useState<unknown[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const tutorialSteps = getTutorialSteps(screenId);
    setSteps(tutorialSteps);
  }, [screenId]);

  useEffect(() => {
    const checkCompletion = async () => {
      if (!user?.id) return;
      const isCompleted = await hasCompletedTutorial(user.id, screenId);
      setCompleted(isCompleted);

      if (autoShow && !isCompleted && steps.length > 0) {
        setVisible(true);
      }
    };

    checkCompletion();
  }, [user?.id, screenId, autoShow, steps.length]);

  const showTutorial = useCallback(() => {
    setVisible(true);
  }, []);

  const hideTutorial = useCallback(() => {
    setVisible(false);
  }, []);

  const handleComplete = useCallback(async () => {
    if (user?.id) {
      await completeTutorial(user.id, screenId);
      setCompleted(true);
    }
    setVisible(false);
  }, [user?.id, screenId]);

  const handleSkip = useCallback(async () => {
    if (user?.id) {
      await markTutorialSkipped(user.id, screenId);
      setCompleted(true);
    }
    setVisible(false);
  }, [user?.id, screenId]);

  const restartTutorial = useCallback(() => {
    setVisible(true);
    setCompleted(false);
  }, []);

  return {
    visible,
    steps,
    completed,
    showTutorial,
    hideTutorial,
    handleComplete,
    handleSkip,
    restartTutorial,
  };
}
