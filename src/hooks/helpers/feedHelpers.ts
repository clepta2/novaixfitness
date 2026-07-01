// src/hooks/helpers/feedHelpers.ts
// Pure helpers for feed data transformations

interface DbPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count?: number;
  comments_count?: number;
  profiles?: { name?: string; avatar_url?: string | null };
}

interface FeedPost {
  id: string;
  userId: string;
  user: { name: string; avatar: string | null };
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt?: string;
  postType?: string;
  feeling?: string | null;
  location?: string | null;
  workout?: string | null;
}

export function mapDbPostToFeed(p: DbPost, likedPostIds: Set<string>): FeedPost {
  const isVideo = p.image_url?.endsWith('.mp4') || p.image_url?.endsWith('.mov');
  let content = p.content;
  let feeling = null;
  let location = null;
  let workout = null;
  try {
    if (p.content && p.content.startsWith('{')) {
      const obj = JSON.parse(p.content);
      content = obj.text || '';
      feeling = obj.feeling;
      location = obj.location;
      workout = obj.workout;
    }
  } catch {}

  return {
    id: p.id,
    userId: p.user_id,
    user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
    content,
    image: p.image_url,
    likes: p.likes_count || 0,
    comments: p.comments_count || 0,
    isLiked: likedPostIds.has(p.id),
    postType: isVideo ? 'video' : (p.image_url ? 'image' : 'text'),
    feeling,
    location,
    workout,
  };
}

export function buildNewPostEntry(data: DbPost & { profiles?: { name?: string; avatar_url?: string | null } }): FeedPost {
  const isVideo = data.image_url?.endsWith('.mp4') || data.image_url?.endsWith('.mov');
  let content = data.content;
  let feeling = null;
  let location = null;
  let workout = null;
  try {
    if (data.content && data.content.startsWith('{')) {
      const obj = JSON.parse(data.content);
      content = obj.text || '';
      feeling = obj.feeling;
      location = obj.location;
      workout = obj.workout;
    }
  } catch {}

  return {
    id: data.id,
    userId: data.user_id,
    user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
    content,
    image: data.image_url,
    createdAt: 'Agora',
    likes: 0,
    comments: 0,
    isLiked: false,
    postType: isVideo ? 'video' : (data.image_url ? 'image' : 'text'),
    feeling,
    location,
    workout,
  };
}

export function computePopularThreshold(posts: FeedPost[]): number {
  if (posts.length === 0) return 1;
  const sorted = [...posts].map(p => p.likes).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  return Math.max(1, median);
}

export function filterFeedPosts(
  posts: FeedPost[],
  selectedFilter: string,
  popularThreshold: number,
  userId: string
): FeedPost[] {
  return posts.filter(post => {
    if (selectedFilter === 'Populares') return post.likes >= popularThreshold;
    if (selectedFilter === 'Meus Posts') return post.userId === userId;
    return true;
  });
}
