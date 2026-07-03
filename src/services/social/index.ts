// src/services/social/index.ts
// Exportações centralizadas de social

export {
  getFeed,
  createPost,
  deletePost,
  toggleLike,
  getComments,
  addComment,
  deleteComment,
  type Post,
  type Comment,
} from './socialFeed';

export {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
  shareWorkout,
  getTrendingPosts,
  searchUsers,
  type User,
} from './socialFollow';

export {
  getActiveStories,
  createStory,
  viewStory,
  deleteStory,
  getStoryViewers,
  cleanupExpiredStories,
} from './stories';

export {
  getDuels,
  acceptDuel,
  completeDuel,
  getActiveDuelsCount,
} from './duels';
