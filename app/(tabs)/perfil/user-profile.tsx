// app/(tabs)/perfil/user-profile.js
// Página de perfil público de outro usuário

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { Avatar, MuteUserButton } from '../../../src/components';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { Header, ErrorBoundary, PostCard } from '../../../src/components';
import { followUser, unfollowUser, isFollowing } from '../../../src/services/social';
import { formatRelativeDate } from '../../../src/helpers/dates';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) loadProfile(); }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    setProfile(data);

    const { data: postData } = await supabase
      .from('posts')
      .select('*, profiles:user_id(name, avatar_url)')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(20);

    setPosts((postData || []).map(p => ({
      id: p.id, userId: p.user_id,
      user: { name: p.profiles?.name || 'Atleta', avatar: p.profiles?.avatar_url || null },
      content: p.content, image: p.image_url,
      createdAt: formatRelativeDate(p.created_at),
      likes: p.likes_count || 0, comments: p.comments_count || 0, isLiked: false,
    })));

    if (user?.id && id !== user.id) {
      const f = await isFollowing(user.id, id);
      setFollowing(f);
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    if (following) {
      await unfollowUser(user.id, id);
      setFollowing(false);
      setProfile(prev => ({ ...prev, followers_count: Math.max(0, (prev?.followers_count || 1) - 1) }));
    } else {
      await followUser(user.id, id);
      setFollowing(true);
      setProfile(prev => ({ ...prev, followers_count: (prev?.followers_count || 0) + 1 }));
    }
  };

  const handleToggleMute = (userId: string) => {
    setIsMuted(prev => !prev);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <Header title="PERFIL" showBack onBack={() => router.back()} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <ErrorBoundary screenName="UserProfile">
      <View style={styles.screen}>
        <Header title={profile.name || 'Perfil'} showBack onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <View style={styles.profileCard}>
            <Avatar name={profile.name} size="xl" />
            <Text style={styles.name}>{profile.name}</Text>
            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{profile.total_workouts || 0}</Text>
                <Text style={styles.statLabel}>Treinos</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{profile.level || 1}</Text>
                <Text style={styles.statLabel}>Nível</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{profile.followers_count || 0}</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{profile.streak || 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>

            {!isOwnProfile && (
              <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.followBtn, following && styles.followingBtn]} accessibilityLabel={following ? 'Deixar de seguir' : 'Seguir'} accessibilityRole="button" onPress={handleFollow}>
                  <Ionicons name={following ? 'checkmark' : 'person-add'} size={16} color={following ? COLORS.primary : COLORS.background} />
                  <Text style={[styles.followText, following && styles.followingText]}>
                    {following ? 'Seguindo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
                <MuteUserButton userId={id} isMuted={isMuted} onToggle={handleToggleMute} />
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>POSTS</Text>
          {posts.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="chatbubble-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Nenhum post ainda</Text>
            </View>
          ) : (
            posts.map(p => (
              <PostCard key={p.id} post={p} currentUserId={user?.id} />
            ))
          )}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
  profileCard: { alignItems: 'center', marginBottom: SPACING.xl, paddingVertical: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginTop: SPACING.md, marginBottom: SPACING.xs },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.xl },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full },
  followText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.background },
  followingBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  followingText: { color: COLORS.primary },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
});
