// app/(tabs)/group.tsx
// Pagina de detalhe do grupo de treino

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { Header, ErrorBoundary, DirectChatDrawer } from '../../src/components';
import { GroupHeaderCard } from '../../src/components/group/GroupHeaderCard';
import { GroupFeedTab } from '../../src/components/group/GroupFeedTab';
import { MembersTab, AboutTab } from '../../src/components/group/GroupSideTabs';
import { getGroupById, getGroupPosts, createGroupPost, joinGroup, leaveGroup } from '../../src/services/groups';
import { useAuth } from '../../src/context/AuthContext';
import { useI18n } from '../../src/i18n';

interface GroupData {
  id: string; name: string; description?: string; member_count?: number; [key: string]: unknown;
}

interface GroupPost {
  id: string; content: string; created_at: string; image_url?: string;
  profiles?: { name?: string }; [key: string]: unknown;
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

  const tabConfig = [
    { key: 'feed' as const, label: 'Discussao' },
    { key: 'membros' as const, label: 'Membros' },
    { key: 'sobre' as const, label: 'Sobre' },
  ];

  return (
    <ErrorBoundary screenName="GroupDetail">
      <View style={styles.screen}>
        <Header title={group.name} showBack />
        <ScrollView contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>

          <GroupHeaderCard group={group} postCount={posts.length} isMember={isMember} onJoinToggle={handleJoin} />

          <View style={styles.tabsContainer}>
            {tabConfig.map(tab => (
              <TouchableOpacity key={tab.key} style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]} onPress={() => setActiveTab(tab.key)}>
                <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'feed' && <GroupFeedTab posts={posts} isMember={isMember} newPost={newPost} onChangePost={setNewPost} onSendPost={handlePost} />}
          {activeTab === 'membros' && <MembersTab group={group} onChatUser={setChatUser} />}
          {activeTab === 'sobre' && <AboutTab group={group} />}
        </ScrollView>

        <DirectChatDrawer visible={chatUser !== null} onClose={() => setChatUser(null)} userName={chatUser?.name || ''} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.xxl },
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: 4, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabButton: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  tabButtonActive: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  tabButtonTextActive: { color: COLORS.primary },
});
