// app/(tabs)/feed.js
// Tela de Comunidade/Feed - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { PostCard, CreatePostModal } from '../../src/components';
import { useSupabaseData } from '../../src/hooks';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { layout, typography } from '../../src/styles';

const filters = ['Todos', 'Populares', 'Recentes', 'Amigos'];

export default function FeedScreen() {
  const { user } = useAuth();
  const { data: dbPosts, refetch } = useSupabaseData('posts', { select: '*, profiles:user_id(name, avatar_url)', orderBy: { column: 'created_at', ascending: false }, mockData: [] });

  const [posts, setPosts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    if (dbPosts) {
      setPosts(dbPosts.map(p => ({
        id: p.id,
        user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
        content: p.content,
        image: p.image_url,
        createdAt: formatDate(p.created_at),
        likes: p.likes_count || 0,
        comments: p.comments_count || 0,
        isLiked: false
      })));
    }
  }, [dbPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const { data: ext } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).single();
      if (ext) {
        await supabase.from('post_likes').delete().eq('id', ext.id);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) } : p));
      } else {
        await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewPost = async (postData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('posts').insert({ user_id: user.id, content: postData.content, image_url: postData.image }).select('*, profiles:user_id(name, avatar_url)').single();
      if (error) throw error;
      setPosts(prev => [{
        id: data.id,
        user: { name: data.profiles?.name || 'Você', avatar: data.profiles?.avatar_url || null },
        content: data.content,
        image: data.image_url,
        createdAt: 'Agora',
        likes: 0,
        comments: 0,
        isLiked: false
      }, ...prev]);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível publicar seu post: ' + err.message);
    }
  };

  const handleComment = async (postId, text) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content: text });
      if (error) throw error;
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      Alert.alert('Sucesso', 'Comentário enviado!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário: ' + err.message);
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return 'Sem data';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
    return diff === 0 ? 'Hoje' : diff === 1 ? 'Ontem' : diff < 7 ? `${diff} dias atrás` : new Date(dateStr).toLocaleDateString('pt-BR');
  }

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={layout.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <View>
            <Text style={typography.h2}>Comunidade</Text>
            <Text style={typography.bodyMuted}>Veja o que seus amigos estão treinando</Text>
          </View>
          <TouchableOpacity style={layout.headerBtn} onPress={() => { setHasNotif(false); Alert.alert('Notificações', 'Você está em dia com a comunidade! Nenhuma notificação pendente.'); }}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
            {hasNotif && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            {filters.map((f) => (
              <TouchableOpacity key={f} style={[styles.chip, selectedFilter === f && styles.chipActive]} onPress={() => setSelectedFilter(f)}>
                <Text style={[typography.bodySmall, selectedFilter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowCreatePost(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color={COLORS.background} />
      </TouchableOpacity>
      <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  notifBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  filtersScroll: { marginLeft: -SPACING.xl, paddingLeft: SPACING.xl, marginBottom: SPACING.xl },
  filters: { flexDirection: 'row', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTextActive: { color: COLORS.background, fontFamily: 'Montserrat_600SemiBold' },
  fab: { position: 'absolute', bottom: 100, right: SPACING.xl, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});
