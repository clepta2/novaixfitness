import { renderHook, act } from '@testing-library/react-hooks';
import { useWorkoutTags } from '../../src/hooks/useWorkoutTags';

const mockWorkouts = [
  { id: 1, name: 'Treino A', category: 'Musculação', exercises: [{ muscle: 'Peito', equipment: 'Barra' }], duration_minutes: 45 },
  { id: 2, name: 'Treino B', category: 'Cardio', exercises: [{ muscle: 'Pernas', equipment: 'Esteira' }], duration_minutes: 30 },
  { id: 3, name: 'Treino C', category: 'Yoga', exercises: [], duration_minutes: 15 },
];

describe('useWorkoutTags Hook', () => {
  it('deve retornar funções e estado', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    expect(result.current).toHaveProperty('selectedTags');
    expect(result.current).toHaveProperty('toggleTag');
    expect(result.current).toHaveProperty('clearAllTags');
    expect(result.current).toHaveProperty('activeTagCount');
    expect(result.current).toHaveProperty('filteredWorkouts');
  });

  it('deve iniciar sem tags selecionadas', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    expect(result.current.selectedTags).toEqual({});
    expect(result.current.activeTagCount).toBe(0);
  });

  it('deve retornar todos os treinos sem filtros', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    expect(result.current.filteredWorkouts).toHaveLength(3);
  });

  it('deve toggleTag adicionar tag', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    act(() => result.current.toggleTag('objective', 'strength'));
    expect(result.current.selectedTags.objective).toContain('strength');
    expect(result.current.activeTagCount).toBe(1);
  });

  it('deve toggleTag remover tag existente', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    act(() => result.current.toggleTag('objective', 'strength'));
    act(() => result.current.toggleTag('objective', 'strength'));
    expect(result.current.selectedTags.objective || []).toHaveLength(0);
    expect(result.current.activeTagCount).toBe(0);
  });

  it('deve clearAllTags limpar todas', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    act(() => result.current.toggleTag('objective', 'strength'));
    act(() => result.current.toggleTag('bodyPart', 'chest'));
    act(() => result.current.clearAllTags());
    expect(result.current.activeTagCount).toBe(0);
  });

  it('deve filtrar treinos por tags', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    act(() => result.current.toggleTag('duration', 'short'));
    expect(result.current.filteredWorkouts.length).toBeLessThan(3);
  });

  it('deve manter treinos quando tags não combinam', () => {
    const { result } = renderHook(() => useWorkoutTags(mockWorkouts));
    act(() => result.current.toggleTag('objective', 'nonexistent'));
    expect(result.current.filteredWorkouts).toHaveLength(0);
  });
});
