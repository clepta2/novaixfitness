// src/services/social.ts
// Servico social - re-exportacao

export { getFeed, createPost, deletePost, toggleLike, getComments, addComment, deleteComment, type Post, type Comment } from './socialFeed';
export { followUser, unfollowUser, getFollowers, getFollowing, isFollowing, shareWorkout, getTrendingPosts, searchUsers, type User } from './socialFollow';
