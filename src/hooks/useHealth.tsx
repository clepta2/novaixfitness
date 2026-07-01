// src/hooks/useHealth.ts
// Hook de integracao com apps de saude - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  requestHealthPermissions,
  syncAllHealthData,
  syncWeightFromHealth,
  syncStepsFromHealth,
  syncCaloriesFromHealth,
  isHealthAvailable,
  getHealthSummary,
} from '../services/healthIntegration';

interface HealthSummary {
  weight?: number;
  steps?: number;
  calories?: number;
  [key: string]: unknown;
}

export function useHealthIntegration() {
  const { user } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    setIsAvailable(isHealthAvailable());
    checkPermission();
  }, []);

  useEffect(() => {
    if (user?.id && hasPermission) {
      loadSummary();
    }
  }, [user?.id, hasPermission]);

  async function checkPermission() {
    const granted = await requestHealthPermissions();
    setHasPermission(granted);
  }

  async function loadSummary() {
    const data = await getHealthSummary(user.id);
    setSummary(data);
  }

  const requestPermission = useCallback(async () => {
    const granted = await requestHealthPermissions();
    setHasPermission(granted);
    return granted;
  }, []);

  const syncAll = useCallback(async () => {
    if (!user?.id || !hasPermission) return null;
    setSyncing(true);
    try {
      const result = await syncAllHealthData(user.id);
      setLastSync(new Date());
      await loadSummary();
      return result;
    } finally {
      setSyncing(false);
    }
  }, [user?.id, hasPermission]);

  const syncWeight = useCallback(async () => {
    if (!user?.id || !hasPermission) return 0;
    setSyncing(true);
    try {
      const count = await syncWeightFromHealth(user.id);
      await loadSummary();
      return count;
    } finally {
      setSyncing(false);
    }
  }, [user?.id, hasPermission]);

  const syncSteps = useCallback(async () => {
    if (!user?.id || !hasPermission) return 0;
    setSyncing(true);
    try {
      const count = await syncStepsFromHealth(user.id);
      await loadSummary();
      return count;
    } finally {
      setSyncing(false);
    }
  }, [user?.id, hasPermission]);

  const syncCalories = useCallback(async () => {
    if (!user?.id || !hasPermission) return 0;
    setSyncing(true);
    try {
      const count = await syncCaloriesFromHealth(user.id);
      await loadSummary();
      return count;
    } finally {
      setSyncing(false);
    }
  }, [user?.id, hasPermission]);

  return {
    isAvailable,
    hasPermission,
    summary,
    syncing,
    lastSync,
    requestPermission,
    syncAll,
    syncWeight,
    syncSteps,
    syncCalories,
    refresh: loadSummary,
  };
}
