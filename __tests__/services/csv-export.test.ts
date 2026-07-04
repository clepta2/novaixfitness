import { exportWorkoutHistory, exportProgressData, exportAnalyticsData, exportAchievements } from '../../src/services/csv-export';
import { supabase } from '../../src/config/supabase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

jest.mock('../../src/config/supabase', () => {
  const { createServiceMock } = require('../../__mocks__/supabase-test');
  return { supabase: createServiceMock() };
});

const { supabase: mockSupabase } = require('../../src/config/supabase');
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  writeAsStringAsync: jest.fn(),
  EncodingType: { UTF8: 'utf8' },
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
  FileSystem.writeAsStringAsync.mockResolvedValue();
  Sharing.isAvailableAsync.mockResolvedValue(true);
  Sharing.shareAsync.mockResolvedValue();

    mockSupabase._reset();
  });

describe('CSV Export Service', () => {
  describe('exportWorkoutHistory', () => {
    it('throws for null userId', async () => {
      await expect(exportWorkoutHistory(null)).rejects.toThrow('Usuario nao autenticado');
    });

    it('exports workout history to CSV', async () => {
      const workouts = [
        {
          completed_at: '2024-01-15T10:00:00Z',
          duration: 30,
          rating: 5,
          notes: 'Bom treino',
          workouts: { title: 'Treino A', category: 'Musculação', level: 'Intermediário' },
        },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalled();
    });

    it('handles empty workout history', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
    });

    it('handles workouts without nested data', async () => {
      const workouts = [
        { completed_at: '2024-01-15T10:00:00Z', duration: 30, rating: null, notes: null, workouts: null },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
    });
  });

  describe('exportProgressData', () => {
    it('throws for null userId', async () => {
      await expect(exportProgressData(null)).rejects.toThrow('Usuario nao autenticado');
    });

    it('exports progress data to CSV', async () => {
      const profile = {
        name: 'João',
        email: 'joao@email.com',
        total_xp: 500,
        total_workouts: 10,
        total_minutes: 300,
        max_streak: 5,
        created_at: '2024-01-01T00:00:00Z',
      };
      const weightLogs = [
        { weight: 80, recorded_at: '2024-01-01T00:00:00Z' },
        { weight: 79, recorded_at: '2024-01-08T00:00:00Z' },
      ];
      supabase.from
        .mockReturnValueOnce(mockChain(profile))
        .mockReturnValueOnce(mockChain(weightLogs));
      const result = await exportProgressData('user-1');
      expect(result).toBe('file:///documents/novaix_progresso.csv');
      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    });

    it('handles missing profile', async () => {
      supabase.from
        .mockReturnValueOnce(mockChain(null))
        .mockReturnValueOnce(mockChain([]));
      const result = await exportProgressData('user-1');
      expect(result).toBe('file:///documents/novaix_progresso.csv');
    });
  });

  describe('exportAnalyticsData', () => {
    it('throws for null userId', async () => {
      await expect(exportAnalyticsData(null)).rejects.toThrow('Usuario nao autenticado');
    });

    it('exports analytics data for month period', async () => {
      const workouts = [
        { completed_at: '2024-01-15T10:00:00Z', duration: 30, workouts: { category: 'Musculação' } },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportAnalyticsData('user-1', 'month');
      expect(result).toBe('file:///documents/novaix_analytics_month.csv');
    });

    it('exports analytics data for week period', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await exportAnalyticsData('user-1', 'week');
      expect(result).toBe('file:///documents/novaix_analytics_week.csv');
    });

    it('exports analytics data for quarter period', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await exportAnalyticsData('user-1', 'quarter');
      expect(result).toBe('file:///documents/novaix_analytics_quarter.csv');
    });

    it('exports analytics data for year period', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await exportAnalyticsData('user-1', 'year');
      expect(result).toBe('file:///documents/novaix_analytics_year.csv');
    });
  });

  describe('exportAchievements', () => {
    it('throws for null userId', async () => {
      await expect(exportAchievements(null)).rejects.toThrow('Usuario nao autenticado');
    });

    it('exports achievements to CSV', async () => {
      const achievements = [
        { achievement_id: 'first_workout', unlocked_at: '2024-01-15T10:00:00Z' },
      ];
      supabase.from.mockReturnValue(mockChain(achievements));
      const result = await exportAchievements('user-1');
      expect(result).toBe('file:///documents/novaix_conquistas.csv');
    });

    it('handles empty achievements', async () => {
      supabase.from.mockReturnValue(mockChain([]));
      const result = await exportAchievements('user-1');
      expect(result).toBe('file:///documents/novaix_conquistas.csv');
    });
  });

  describe('CSV formatting', () => {
    it('handles values with commas', async () => {
      const workouts = [
        {
          completed_at: '2024-01-15T10:00:00Z',
          duration: 30,
          rating: 5,
          notes: 'Treino bom, gostei',
          workouts: { title: 'Treino A, B', category: 'Musculação', level: 'Intermediário' },
        },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
    });

    it('handles values with quotes', async () => {
      const workouts = [
        {
          completed_at: '2024-01-15T10:00:00Z',
          duration: 30,
          rating: 5,
          notes: 'Treino "ótimo"',
          workouts: { title: 'Treino A', category: 'Musculação', level: 'Intermediário' },
        },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
    });

    it('handles null values', async () => {
      const workouts = [
        {
          completed_at: '2024-01-15T10:00:00Z',
          duration: null,
          rating: null,
          notes: null,
          workouts: null,
        },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
    });
  });

  describe('Sharing', () => {
    it('does not share when not available', async () => {
      Sharing.isAvailableAsync.mockResolvedValue(false);
      const workouts = [
        {
          completed_at: '2024-01-15T10:00:00Z',
          duration: 30,
          rating: 5,
          notes: '',
          workouts: { title: 'Treino A', category: 'Musculação', level: 'Intermediário' },
        },
      ];
      supabase.from.mockReturnValue(mockChain(workouts));
      const result = await exportWorkoutHistory('user-1');
      expect(result).toBe('file:///documents/novaix_historico_treinos.csv');
      expect(Sharing.shareAsync).not.toHaveBeenCalled();
    });
  });
});
