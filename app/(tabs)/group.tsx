// app/(tabs)/group.tsx
// Página de detalhe do grupo de treino

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Avatar } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { getGroupById, getGroupPosts, createGroupPost, joinGroup, leaveGroup } from '../../src/services/groups';
import { Header, ErrorBoundary, DirectChatDrawer } from '../../src/components';
import { useI18n } from '../../src/i18n';

interface GroupData {
  id: string;
  name: string;
  description?: string;
  member_count?: number;
  [key: string]: unknown;
}

interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  image_url?: string;
  profiles?: { name?: string };
  [key: string]: unknown;
}

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useI18n();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'membros' | 'sobre'>('feed');
  const [chatUser, setChatUser] = useState<{ name: string } | null>(null);

  useEffect(() => { if (id) loadGroup(); }, [id]);

  const loadGroup = async () => {
    setLoading(true);
    const g = await getGroupById(id);
    setGroup(g as GroupData);
    const p = await getGroupPosts(id);
    setPosts((p || []) as GroupPost[]);
    setIsMember((g as GroupData)?.member_count != null && (g as GroupData).member_count! > 0);
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!user?.id || !id) return;
    if (isMember) {
      await leaveGroup(id, user.id);
      setIsMember(false);
      setGroup(prev => prev ? { ...prev, member_count: Math.max(0, (prev.member_count || 1) - 1) } : prev);
    } else {
      await joinGroup(id, user.id);
      setIsMember(true);
      setGroup(prev => prev ? { ...prev, member_count: (prev.member_count || 0) + 1 } : prev);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim() || !user?.id || !id) return;
    const post = await createGroupPost(id, user.id, newPost.trim(), null);
    setPosts(prev => [post as GroupPost, ...prev]);
    setNewPost('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGroup();
    setRefreshing(false);
  };

  if (loading || !group) {
    return (
      <View style={styles.center}>
        <Header title={t('social.group').toUpperCase()} showBack />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="GroupDetail">
      <View style={styles.screen}>
        <Header title={group.name} showBack />

        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <View style={styles.groupInfo}>
            {/* Cover image */}
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600' }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.groupHeaderContent}>
              <Text style={styles.groupName}>{group.name}</Text>
              {group.description && <Text style={styles.groupDesc} numberOfLines={2}>{group.description}</Text>}
              
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{group.member_count || 0}</Text>
                  <Text style={styles.statLabel}>{t('social.members')}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{posts.length}</Text>
                  <Text style={styles.statLabel}>{t('social.posts')}</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.joinBtn, isMember && styles.leaveBtn]} accessibilityLabel={isMember ? t('social.leaveGroup') : t('social.joinGroup')} accessibilityRole="button" onPress={handleJoin}>
                <Text style={[styles.joinText, isMember && styles.leaveText]}>
                  {isMember ? t('social.leaveGroup').toUpperCase() : t('social.joinGroup').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Group Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'feed' && styles.tabButtonActive]} onPress={() => setActiveTab('feed')}>
              <Text style={[styles.tabButtonText, activeTab === 'feed' && styles.tabButtonTextActive]}>Discussão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'membros' && styles.tabButtonActive]} onPress={() => setActiveTab('membros')}>
              <Text style={[styles.tabButtonText, activeTab === 'membros' && styles.tabButtonTextActive]}>Membros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'sobre' && styles.tabButtonActive]} onPress={() => setActiveTab('sobre')}>
              <Text style={[styles.tabButtonText, activeTab === 'sobre' && styles.tabButtonTextActive]}>Sobre</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'feed' && (
            <View>
              {isMember && (
                <View style={styles.postInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('social.shareWithGroup')}
                    placeholderTextColor={COLORS.textMuted}
                    value={newPost}
                    onChangeText={setNewPost}
                    multiline
                  />
                  <TouchableOpacity style={styles.sendBtn} accessibilityLabel={t('social.sendPost')} accessibilityRole="button" onPress={handlePost} disabled={!newPost.trim()}>
                    <Ionicons name="send" size={18} color={newPost.trim() ? COLORS.primary : COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.sectionTitle}>{t('social.groupPosts')}</Text>
              {posts.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="chatbubbles-outline" size={40} color={COLORS.textMuted} />
                  <Text style={styles.emptyText}>{t('social.noPosts')}</Text>
                </View>
              ) : (
                posts.map(post => (
                  <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                      <Avatar name={post.profiles?.name} size="sm" />
                      <View style={styles.postInfo}>
                        <Text style={styles.postAuthor}>{post.profiles?.name || t('social.member')}</Text>
                        <Text style={styles.postTime}>{new Date(post.created_at).toLocaleDateString('pt-BR')}</Text>
                      </View>
                    </View>
                    <Text style={styles.postContent}>{post.content}</Text>
                    {post.image_url && <Image source={{ uri: post.image_url }} style={styles.postImage} resizeMode="cover" />}
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'membros' && (
            <View style={styles.tabContentCard}>
              <Text style={styles.tabContentTitle}>Membros ({group.member_count || 1})</Text>
              {['Você', 'Jeferson Henrique', 'Alex Silva', 'Bruno Souza'].map((name, index) => (
                <View key={index} style={styles.memberRow}>
                  <Avatar name={name} size="sm" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{name}</Text>
                    <Text style={styles.memberRole}>{index === 1 ? 'Administrador' : 'Membro'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setChatUser({ name })}>
                    <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'sobre' && (
            <View style={styles.tabContentCard}>
              <Text style={styles.tabContentTitle}>Sobre o Grupo</Text>
              <Text style={styles.tabContentDesc}>{group.description || 'Grupo focado em compartilhar treinos, metas de peso e dicas de fitness.'}</Text>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleTitle}>1. Respeito Mútuo</Text>
                <Text style={styles.ruleDesc}>Sem posts ofensivos ou julgamento. Todos estão aqui para evoluir.</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleTitle}>2. Foco em Fitness</Text>
                <Text style={styles.ruleDesc}>Compartilhe fotos de progresso, rotinas de musculação e cárdio.</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <DirectChatDrawer
          visible={chatUser !== null}
          onClose={() => setChatUser(null)}
          userName={chatUser?.name || ''}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
  groupInfo: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', marginBottom: SPACING.xl },
  coverContainer: { width: '100%', height: 120, backgroundColor: COLORS.surfaceElevated },
  coverImage: { width: '100%', height: '100%' },
  groupHeaderContent: { padding: SPACING.lg, alignItems: 'center' },
  groupName: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  groupDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.md, paddingHorizontal: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.xxl, marginBottom: SPACING.md },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  joinBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxxl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.full },
  joinText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
  leaveBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.error },
  leaveText: { color: COLORS.error },
  postInput: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, marginBottom: SPACING.xl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, minHeight: 40, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, maxHeight: 100 },
  sendBtn: { padding: SPACING.xs },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
  postCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  postInfo: { flex: 1 },
  postAuthor: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  postTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  postContent: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  postImage: { width: '100%', height: 150, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.sm, backgroundColor: COLORS.surfaceElevated },
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: 4, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabButton: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  tabButtonActive: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  tabButtonTextActive: { color: COLORS.primary },
  tabContentCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabContentTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, marginBottom: SPACING.md },
  tabContentDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 20, marginBottom: SPACING.lg },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  memberName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  memberRole: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  ruleItem: { marginTop: SPACING.md },
  ruleTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: 2 },
  ruleDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, lineHeight: 18 },
});
