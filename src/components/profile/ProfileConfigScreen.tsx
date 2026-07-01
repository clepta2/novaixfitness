// @ts-nocheck
// src/components/profile/ProfileConfigScreen.tsx
// Tela de perfil com animacoes e melhorias visuais - NOVAIX FITNESS

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { ProfileHero, WeightLogger, EditNameModal, OfflineSettings, TutorialOverlay, ErrorBoundary, PostCard, CreatePostModal, Avatar, ConsistencyHeatmap, WeightProgressChart } from '../../components';
import { supabase } from '../../config/supabase';
import { useTutorial } from '../../hooks/useTutorial';
import { useProfileEdit } from '../../hooks/useProfileEdit';
import MuscleMiniRadar from '../../components/profile/MuscleMiniRadar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { layout, typography } from '../../styles';
import { THEME_OPTIONS } from '../../data/settingsOptions';
import { useResponsive } from '../../hooks/useResponsive';

const QUICK_LINKS = [
  { icon: 'notifications-outline', color: COLORS.attention, label: 'Notificacoes', route: '/settings/notifications' },
  { icon: 'color-palette-outline', color: COLORS.purple, label: 'Aparencia', route: '/settings/appearance' },
  { icon: 'language-outline', color: COLORS.cyan, label: 'Idioma', route: '/settings/language' },
  { icon: 'person-outline', color: COLORS.success, label: 'Conta', route: '/settings/account' },
  { icon: 'card-outline', color: COLORS.secondary, label: 'Assinatura', route: '/subscription' },
  { icon: 'download-outline', color: COLORS.success, label: 'Exportar Dados', route: '/export-data' },
  { icon: 'shield-checkmark-outline', color: COLORS.info, label: 'Privacidade', route: '/(tabs)/perfil/lgpd' },
  { icon: 'ribbon-outline', color: COLORS.purple, label: 'Seja um Coach', route: '/register-coach' },
  { icon: 'help-circle-outline', color: COLORS.textMuted, label: 'Ajuda', route: '/(tabs)/ajuda' },
];

interface ProfileConfigScreenProps {
  headerIcon?: string;
  screenName?: string;
  tutorialKey?: string;
  isSmall?: boolean;
}

export default function ProfileConfigScreen({ headerIcon = 'person', screenName = 'Conta', tutorialKey = 'perfil', isSmall = false }: ProfileConfigScreenProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const {
    profile, stats, showEditName, setShowEditName,
    userName, userEmail, memberSince,
    handleUpdateAvatar, updateProfileName,
  } = useProfileEdit();
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial(tutorialKey, true);

  const [activeTab, setActiveTab] = useState<'posts' | 'sobre' | 'opcoes'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Animacoes
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadUserPosts();
    }
  }, [user?.id]);

  const loadUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const formatted = (data || []).map((p: any) => {
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
          user: { name: p.profiles?.name || userName, avatar: p.profiles?.avatar_url || profile?.avatar_url },
          content,
          image: p.image_url,
          createdAt: 'Publicado',
          likes: p.likes_count || 0,
          comments: p.comments_count || 0,
          isLiked: false,
          postType: isVideo ? 'video' : (p.image_url ? 'image' : 'text'),
          feeling,
          location,
          workout,
        };
      });
      setPosts(formatted);
    } catch (err) {
      if (__DEV__) console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleNewPost = async (postData: any): Promise<void> => {
    if (!user) return;
    try {
      const dbContent = (postData.feeling || postData.location || postData.workout)
        ? JSON.stringify({ text: postData.content, feeling: postData.feeling, location: postData.location, workout: postData.workout })
        : postData.content;
      const { data, error } = await supabase.from('posts')
        .insert({ user_id: user.id, content: dbContent, image_url: postData.image })
        .select('*, profiles:user_id(name, avatar_url)').single();
      if (error) throw error;
      loadUserPosts();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível publicar seu post: ' + (err as Error).message);
    }
  };

  return (
    <ErrorBoundary screenName={screenName}>
      <ScrollView style={layout.screen} contentContainerStyle={[layout.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />

        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <View style={styles.headerIconWrap}>
            <Ionicons name={headerIcon} size={20} color={COLORS.primary} />
          </View>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Profile Hero */}
          <ProfileHero
            name={userName}
            email={userEmail}
            memberSince={memberSince}
            uri={profile?.avatar_url}
            onPressAvatar={handleUpdateAvatar}
            onEditName={() => setShowEditName(true)}
            stats={stats}
          />

          {/* Tabs estilo Facebook */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'posts' && styles.tabButtonActive]} onPress={() => setActiveTab('posts')}>
              <Text style={[styles.tabButtonText, activeTab === 'posts' && styles.tabButtonTextActive]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'sobre' && styles.tabButtonActive]} onPress={() => setActiveTab('sobre')}>
              <Text style={[styles.tabButtonText, activeTab === 'sobre' && styles.tabButtonTextActive]}>Sobre</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, activeTab === 'opcoes' && styles.tabButtonActive]} onPress={() => setActiveTab('opcoes')}>
              <Text style={[styles.tabButtonText, activeTab === 'opcoes' && styles.tabButtonTextActive]}>Opções</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'posts' && (
            <View>
              {/* Composer Box */}
              <View style={styles.composerCard}>
                <View style={styles.composerRow}>
                  <Avatar name={userName} uri={profile?.avatar_url} size="md" />
                  <TouchableOpacity style={styles.composerInputMock} onPress={() => setShowCreatePost(true)}>
                    <Text style={styles.composerInputText}>No que você está pensando, {userName?.split(' ')[0]}?</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* User posts */}
              {loadingPosts ? (
                <Text style={styles.centerText}>Carregando publicações...</Text>
              ) : posts.length === 0 ? (
                <View style={styles.emptyFeed}>
                  <Ionicons name="chatbox-ellipses-outline" size={40} color={COLORS.textMuted} />
                  <Text style={styles.emptyFeedText}>Nenhum post publicado ainda.</Text>
                </View>
              ) : (
                posts.map(p => (
                  <PostCard key={p.id} post={p} currentUserId={user?.id} />
                ))
              )}
            </View>
          )}

          {activeTab === 'sobre' && (
            <View>
              {user?.id && (
                <View style={layout.section}>
                  <MuscleMiniRadar userId={user.id} />
                </View>
              )}
              <ConsistencyHeatmap />
              <WeightProgressChart />
              <WeightLogger />
              <OfflineSettings />
            </View>
          )}

          {activeTab === 'opcoes' && (
            <View>
              {/* Tema */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="color-palette" size={18} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>APARÊNCIA</Text>
                </View>
                <View style={styles.themeRow}>
                  {THEME_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.key}
                      style={[styles.themeBtn, themeMode === opt.key && styles.themeBtnActive]}
                      onPress={() => setThemeMode(opt.key)}
                    >
                      <Ionicons name={opt.icon} size={20} color={themeMode === opt.key ? COLORS.background : COLORS.textMuted} />
                      <Text style={[styles.themeBtnText, themeMode === opt.key && styles.themeBtnTextActive]}>{opt.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quick Links */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="grid" size={18} color={COLORS.primary} />
                  <Text style={styles.sectionTitle}>ATALHOS</Text>
                </View>
                {(profile?.role === 'creator' || profile?.role === 'admin'
                  ? [...QUICK_LINKS, { icon: 'analytics-outline', color: COLORS.primary, label: 'Painel do Coach', route: '/coach-dashboard' }]
                  : QUICK_LINKS
                ).map((link, index) => (
                  <Animated.View key={link.route} style={{ opacity: Math.min(1, 0.5 + index * 0.05) }}>
                    <TouchableOpacity style={styles.quickLink} onPress={() => router.push(link.route)}>
                      <View style={[styles.quickLinkIcon, { backgroundColor: link.color + '15' }]}>
                        <Ionicons name={link.icon} size={18} color={link.color} />
                      </View>
                      <Text style={styles.quickLinkText}>{link.label}</Text>
                      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>

              {/* Logout */}
              <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: signOut }])}>
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text style={styles.logoutText}>Sair da conta</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <EditNameModal visible={showEditName} onClose={() => setShowEditName(false)} initialName={userName} onSave={updateProfileName} />
        <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} userId={user?.id} />
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  headerIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  themeRow: { flexDirection: 'row', gap: SPACING.sm },
  themeBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  themeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, ...SHADOWS.sm },
  themeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  themeBtnTextActive: { color: COLORS.background },
  quickLink: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  quickLinkIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  quickLinkText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '12', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.xl },
  logoutText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.error },
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: 4, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabButton: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  tabButtonActive: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  tabButtonTextActive: { color: COLORS.primary },
  composerCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  composerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  composerInputMock: { flex: 1, height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  composerInputText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  centerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
  emptyFeed: { alignItems: 'center', paddingVertical: SPACING.xxxl, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.xl },
  emptyFeedText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
});
