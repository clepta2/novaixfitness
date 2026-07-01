// src/hooks/useAnalyticsAdmin.ts
// Hooks administrativos: cohort, retencao, segmentacao

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCohortAnalysis, getUserRetention, getUserSegmentation } from '../services/analyticsAdvanced';

interface CohortData {
  week: string;
  retained: number;
  total: number;
  percentage: number;
}

interface SegmentData {
  segment: string;
  count: number;
  percentage: number;
}

interface SegmentationResult {
  segments: Record<string, unknown[]>;
  stats: {
    total: number;
    free: number;
    basic: number;
    premium: number;
    powerUsers: number;
    newUsers: number;
  };
}

export function useCohortAnalysis(period: string = 'weekly') {
  const [data, setData] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCohortAnalysis(period)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return { data, loading };
}

export function useUserRetention(days: number = 30) {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getUserRetention(user.id, days)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, days]);

  return { data, loading };
}

export function useUserSegmentation() {
  const [data, setData] = useState<SegmentationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserSegmentation()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
