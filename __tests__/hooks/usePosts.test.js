import { renderHook, act } from '../../__mocks__/render-hook';
import { usePosts, usePostComments } from '../../src/hooks/usePosts';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockChain = (data = null, error = null) => {
  const chain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
  };
  chain.then = jest.fn((resolve) => resolve({ data, error }));
  return chain;
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: { id: 'test-user', name: 'Test User' } });
});

describe('usePosts', () => {
  it('fetches posts on mount', async () => {
    const mockPosts = [{ id: '1', content: 'Hello', profiles: { name: 'Test' } }];
    supabase.from.mockReturnValue(mockChain(mockPosts));

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toEqual(mockPosts);
  });

  it('createPost inserts a post', async () => {
    const mockPosts = [];
    supabase.from
      .mockReturnValueOnce(mockChain(mockPosts))
      .mockReturnValueOnce(mockChain());

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.createPost('New post content');
    });

    expect(supabase.from).toHaveBeenCalledWith('posts');
  });

  it('createPost does nothing with empty content', async () => {
    supabase.from.mockReturnValue(mockChain([]));

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.createPost('   ');
    });

    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it('createPost does nothing without user', async () => {
    useAuth.mockReturnValue({ user: null });
    supabase.from.mockReturnValue(mockChain([]));

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.createPost('Test');
    });

    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  it('toggleLike adds like when none exists', async () => {
    supabase.from
      .mockReturnValueOnce(mockChain([]))
      .mockReturnValueOnce(mockChain(null))
      .mockReturnValueOnce(mockChain())
      .mockReturnValueOnce(mockChain([]));

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.toggleLike('post-1');
    });

    expect(supabase.from).toHaveBeenCalledWith('post_likes');
  });

  it('toggleLike removes like when exists', async () => {
    const existingLike = { id: 'like-1', post_id: 'post-1', user_id: 'test-user' };
    supabase.from
      .mockReturnValueOnce(mockChain([]))
      .mockReturnValueOnce(mockChain(existingLike))
      .mockReturnValueOnce(mockChain())
      .mockReturnValueOnce(mockChain([]));

    const { result } = renderHook(() => usePosts());

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.toggleLike('post-1');
    });

    expect(supabase.from).toHaveBeenCalledWith('post_likes');
  });
});

describe('usePostComments', () => {
  it('fetches comments for a post', async () => {
    const mockComments = [{ id: '1', content: 'Great!', profiles: { name: 'User' } }];
    supabase.from.mockReturnValue(mockChain(mockComments));

    const { result } = renderHook(() => usePostComments('post-1'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    expect(result.current.comments).toEqual(mockComments);
    expect(result.current.loading).toBe(false);
  });

  it('does not fetch without postId', async () => {
    const { result } = renderHook(() => usePostComments(null));

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    expect(result.current.comments).toEqual([]);
  });

  it('addComment inserts a comment', async () => {
    supabase.from
      .mockReturnValueOnce(mockChain([]))
      .mockReturnValueOnce(mockChain())
      .mockReturnValueOnce(mockChain([]));

    const { result } = renderHook(() => usePostComments('post-1'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.addComment('Nice workout!');
    });

    expect(supabase.from).toHaveBeenCalledWith('post_comments');
  });

  it('addComment does nothing with empty content', async () => {
    supabase.from.mockReturnValue(mockChain([]));

    const { result } = renderHook(() => usePostComments('post-1'));

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    await act(async () => {
      await result.current.addComment('   ');
    });

    expect(supabase.from).toHaveBeenCalledTimes(1);
  });
});
