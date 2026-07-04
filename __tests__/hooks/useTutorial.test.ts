import { renderHook } from '@testing-library/react-hooks';
import { useTutorial } from '../../src/hooks/useTutorial';
import { useAuth } from '../../src/context/AuthContext';
import { getTutorialSteps } from '../../src/services/tutorial';

jest.mock('../../src/context/AuthContext');
jest.mock('../../src/services/tutorial');

describe('useTutorial Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 'user-123' } });
    getTutorialSteps.mockReturnValue([{ id: 1, title: 'Step 1' }]);
  });

  it('deve retornar funções e estado inicial', () => {
    const { result } = renderHook(() => useTutorial('home'));
    
    expect(result.current).toHaveProperty('visible');
    expect(result.current).toHaveProperty('steps');
    expect(result.current).toHaveProperty('completed');
    expect(result.current).toHaveProperty('showTutorial');
    expect(result.current).toHaveProperty('hideTutorial');
    expect(result.current).toHaveProperty('handleComplete');
    expect(result.current).toHaveProperty('handleSkip');
    expect(result.current).toHaveProperty('restartTutorial');
    
    expect(result.current.visible).toBe(false);
    expect(result.current.completed).toBe(false);
    expect(result.current.steps).toHaveLength(1);
  });

  it('deve retornar função showTutorial', () => {
    const { result } = renderHook(() => useTutorial('home'));
    expect(typeof result.current.showTutorial).toBe('function');
  });

  it('deve retornar função hideTutorial', () => {
    const { result } = renderHook(() => useTutorial('home'));
    expect(typeof result.current.hideTutorial).toBe('function');
  });

  it('deve retornar função handleComplete', () => {
    const { result } = renderHook(() => useTutorial('home'));
    expect(typeof result.current.handleComplete).toBe('function');
  });

  it('deve retornar função handleSkip', () => {
    const { result } = renderHook(() => useTutorial('home'));
    expect(typeof result.current.handleSkip).toBe('function');
  });

  it('deve retornar função restartTutorial', () => {
    const { result } = renderHook(() => useTutorial('home'));
    expect(typeof result.current.restartTutorial).toBe('function');
  });
});
