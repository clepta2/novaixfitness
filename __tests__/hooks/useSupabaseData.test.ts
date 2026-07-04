import { renderHook, act } from '../../__mocks__/render-hook';
import { useSupabaseData } from '../../src/hooks/useSupabaseData';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useSupabaseData', () => {
  it('fetches data on mount', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    const pingChain = mockChain([]);
    const dataChain = mockChain(mockData);
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain);

    const { result } = renderHook(() => useSupabaseData('workouts'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isConnected).toBe(true);
  });

  it('uses mockData when Supabase connection fails', async () => {
    const mockData = [{ id: 'mock', name: 'Mock Item' }];
    const pingChain = mockChain(null, { message: 'Connection error' });
    supabase.from.mockReturnValue(pingChain);

    const { result } = renderHook(() => useSupabaseData('workouts', { mockData }));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isConnected).toBe(false);
  });

  it('applies filters', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain);

    renderHook(() => useSupabaseData('workouts', {
      filters: [{ column: 'category', value: 'Musculacao' }],
    }));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    expect(dataChain.eq).toHaveBeenCalledWith('category', 'Musculacao');
  });

  it('applies orderBy', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain);

    renderHook(() => useSupabaseData('workouts', {
      orderBy: { column: 'created_at', ascending: false },
    }));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    expect(dataChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('applies limit', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain);

    renderHook(() => useSupabaseData('workouts', { limit: 10 }));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    expect(dataChain.limit).toHaveBeenCalledWith(10);
  });

  it('insert adds a record', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    const insertChain = mockChain({ id: '1', name: 'New Workout' });
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain)
      .mockReturnValueOnce(insertChain);

    const { result } = renderHook(() => useSupabaseData('workouts'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    let insertResult;
    await act(async () => {
      insertResult = await result.current.insert({ name: 'New Workout' });
    });

    expect(insertResult.data).toEqual({ id: '1', name: 'New Workout' });
  });

  it('update modifies a record', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    const updateChain = mockChain({ id: '1', name: 'Updated' });
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain)
      .mockReturnValueOnce(updateChain);

    const { result } = renderHook(() => useSupabaseData('workouts'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.update('1', { name: 'Updated' });
    });

    expect(updateResult.data).toEqual({ id: '1', name: 'Updated' });
  });

  it('remove deletes a record', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    const deleteChain = mockChain();
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain)
      .mockReturnValueOnce(deleteChain);

    const { result } = renderHook(() => useSupabaseData('workouts'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove('1');
    });

    expect(removeResult.success).toBe(true);
  });

  it('returns error on insert failure', async () => {
    const pingChain = mockChain([]);
    const dataChain = mockChain([]);
    const insertChain = mockChain(null, { message: 'Insert failed' });
    supabase.from
      .mockReturnValueOnce(pingChain)
      .mockReturnValueOnce(dataChain)
      .mockReturnValueOnce(insertChain);

    const { result } = renderHook(() => useSupabaseData('workouts'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 200));
    });

    let insertResult;
    await act(async () => {
      insertResult = await result.current.insert({ name: 'Test' });
    });

    expect(insertResult.error).toBeTruthy();
  });
});
