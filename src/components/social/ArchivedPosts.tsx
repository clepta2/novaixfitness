// src/components/social/ArchivedPosts.tsx
// Grid de posts arquivados com opcao de restaurar

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';

type ArchivedPost = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
};

interface ArchivedPostsProps {
  userId: string;
}

export default function ArchivedPosts({ userId }: ArchivedPostsProps) {
  const [posts, setPosts] = useState<ArchivedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchived();
  }, [userId]);

  const fetchArchived = async () => {
    setLoading(true);
    const { data } = await supabase
      .from(TABLES.POSTS)
      .select('id, content, image_url, created_at, likes_count')
      .eq('user_id', userId)
      .eq('archived', true)
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const handleRestore = async (postId: string) => {
    await supabase.from(TABLES.POSTS).update({ archived: false }).eq('id', postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const renderPost = ({ item }: { item: ArchivedPost }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Ionicons name="document-text" size={24} color={COLORS.textMuted} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
        <Text style={styles.meta}>{item.likes_count} curtidas</Text>
      </View>
      <TouchableOpacity
        style={styles.restoreBtn}
        onPress={() => handleRestore(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={14} color={COLORS.primary} />
        <Text style={styles.restoreText}>Restaurar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.empty}>
        <Ionicons name="archive" size={24} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="archive" size={16} color={COLORS.primary} />
        <Text style={styles.title}>Arquivados</Text>
        <Text style={styles.count}>{posts.length}</Text>
      </View>
      {posts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum post arquivado</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    flex: 1,
  },
  count: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
  },
  noImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: SPACING.sm },
  content: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textTitle,
  },
  meta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  restoreText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: COLORS.primary,
  },
  separator: { height: SPACING.xs },
  empty: {
    alignItems: 'center',
    padding: SPACING.xxl,
    gap: SPACING.xs,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
