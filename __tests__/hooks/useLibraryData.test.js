import { renderHook } from '@testing-library/react-hooks';
import { useLibraryData } from '../../src/hooks/useLibraryData';
import { useAuth } from '../../src/context/AuthContext';
import { useSupabaseData } from '../../src/hooks/useSupabaseData';
import { isWorkoutCached } from '../../src/services/offline';

jest.mock('../../src/context/AuthContext');
jest.mock('../../src/hooks/useSupabaseData');
jest.mock('../../src/services/offline');
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('useLibraryData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 'user-123' } });
    useSupabaseData.mockReturnValue({ data: [] });
    isWorkoutCached.mockResolvedValue(false);
  });

  it('deve retornar funções e estado', () => {
    const { result } = renderHook(() => useLibraryData());
    expect(result.current).toHaveProperty('selectedCategory');
    expect(result.current).toHaveProperty('searchQuery');
    expect(result.current).toHaveProperty('favorites');
    expect(result.current).toHaveProperty('filteredWorkouts');
    expect(result.current).toHaveProperty('showFilters');
    expect(result.current).toHaveProperty('cachedIds');
  });

  it('deve retornar funções de filtro', () => {
    const { result } = renderHook(() => useLibraryData());
    expect(typeof result.current.setSelectedCategory).toBe('function');
    expect(typeof result.current.setSearchQuery).toBe('function');
    expect(typeof result.current.setShowFilters).toBe('function');
  });

  it('deve inicializar com estado padrão', () => {
    const { result } = renderHook(() => useLibraryData());
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.searchQuery).toBe('');
    expect(result.current.favorites).toEqual([]);
    expect(result.current.showFilters).toBe(false);
  });
});
