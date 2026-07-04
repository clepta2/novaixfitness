import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SOCIAL_FEED } from '../../data/socialTexts';

interface Post {
  id: string;
  userId: string;
  user: { name: string; avatar: string | null };
  content: string;
  image: string | null;
  postType: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface SocialFeedProps {
  posts: Post[];
  loading: boolean;
  userId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
}

function filterPosts(posts: Post[], filter: string): Post[] {
  if (filter === 'all') return posts;
  if (filter === 'popular') return [...posts].sort((a, b) => b.likes - a.likes);
  return posts;
}

function PostItem({ post, onLike, onComment, currentUserId }: { post: Post; onLike?: (id: string) => void; onComment?: (id: string, text: string) => void; currentUserId?: string }) {
  const isOwner = currentUserId === post.userId;

  return (
    <View style={postStyles.container}>
      <View style={postStyles.avatarWrap}>
        {post.user?.avatar ? (
          <Image source={{ uri: post.user.avatar }} style={postStyles.avatar} />
        ) : (
          <View style={postStyles.avatarFallback}>
            <Text style={postStyles.avatarText}>{(post.user?.name || 'A')[0].toUpperCase()}</Text>
          </View>
        )}
      </View>

      <View style={postStyles.content}>
        <View style={postStyles.header}>
          <Text style={postStyles.userName}>{post.user?.name || 'Atleta'}</Text>
          <Text style={postStyles.time}>{post.createdAt}</Text>
        </View>

        <Text style={postStyles.text}>{post.content}</Text>

        {post.image && (
          <Image source={{ uri: post.image }} style={postStyles.postImage} resizeMode="cover" />
        )}

        <View style={postStyles.actions}>
          <TouchableOpacity
            style={postStyles.actionBtn}
            onPress={() => onLike?.(post.id)}
            accessibilityLabel={post.isLiked ? 'Descurtir' : 'Curtir'}
            accessibilityRole="button"
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={post.isLiked ? COLORS.error : COLORS.textMuted}
            />
            <Text style={[postStyles.actionText, post.isLiked && { color: COLORS.error }]}>
              {post.likes || 0}
            </Text>
          </TouchableOpacity>

          <View style={postStyles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textMuted} />
            <Text style={postStyles.actionText}>{post.comments || 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(function SocialFeed({ posts, loading, userId, onLike, onComment }: SocialFeedProps) {
  const [filter, setFilter] = React.useState('all');

  const filtered = useMemo(() => filterPosts(posts, filter), [posts, filter]);

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'popular', label: 'Populares' },
  ];

  if (loading && posts.length === 0) {
    return (
      <View style={styles.loading}>
        <Ionicons name="sync" size={20} color={COLORS.textMuted} />
        <Text style={styles.loadingText}>{SOCIAL_FEED.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={18} color={COLORS.primary} />
        <Text style={styles.title}>{SOCIAL_FEED.title}</Text>
      </View>

      {posts.length > 0 && (
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity key={f.key} style={[styles.filterBtn, filter === f.key && styles.filterActive]} onPress={() => setFilter(f.key)}>
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>{SOCIAL_FEED.emptyState}</Text>
        </View>
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PostItem post={item} onLike={onLike} onComment={onComment} currentUserId={userId} />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  loading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.xl },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  filterRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md },
  filterBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  filterActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  filterTextActive: { color: COLORS.background },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.sm },
  separator: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
});

const postStyles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.md, padding: SPACING.sm },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarFallback: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary + '30', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  userName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  time: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
  text: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
  postImage: { width: '100%', height: 160, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.sm },
  actions: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
