// @ts-nocheck
// src/components/profile/ProfileConfigScreen.tsx
// Tela de perfil com animacoes - NOVAIX FITNESS

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { ProfileHero, EditNameModal, TutorialOverlay, ErrorBoundary, CreatePostModal } from '../../components';
import { supabase } from '../../config/supabase';
import { useTutorial } from '../../hooks/useTutorial';
import { useProfileEdit } from '../../hooks/useProfileEdit';
import MuscleMiniRadar from '../../components/profile/MuscleMiniRadar';
import ProfilePostsTab from '../../components/profile/ProfilePostsTab';
import ProfileOptionsTab from '../../components/profile/ProfileOptionsTab';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { layout } from '../../styles';
import { SECTION_TITLES } from '../../data/profileTexts';

interface Props {
  headerIcon?: string;
  screenName?: string;
  tutorialKey?: string;
  isSmall?: boolean;
}

export default function ProfileConfigScreen({ headerIcon = 'person', screenName = 'Conta', tutorialKey = 'perfil', isSmall = false }: Props) {
  const { user, signOut } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { profile, stats, showEditName, setShowEditName, userName, userEmail, memberSince, handleUpdateAvatar, updateProfileName } = useProfileEdit();
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial(tutorialKey, true);
  const [activeTab, setActiveTab] = useState<'posts' | 'sobre' | 'opcoes'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => { if (user?.id) loadUserPosts(); }, [user?.id]);

  const loadUserPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await supabase.from('posts')
        .select('*, profiles:user_id(name, avatar_url)')
        .eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10);
      const formatted = (data || []).map((p: any) => {
        const isVideo = p.image_url?.endsWith('.mp4') || p.image_url?.endsWith('.mov');
        let content = p.content; let feeling = null; let location = null; let workout = null;
        try {
          if (p.content?.startsWith('{')) { const obj = JSON.parse(p.content); content = obj.text || ''; feeling = obj.feeling; location = obj.location; workout = obj.workout; }
        } catch {}
        return { id: p.id, userId: p.user_id, user: { name: p.profiles?.name || userName, avatar: p.profiles?.avatar_url || profile?.avatar_url },
          content, image: p.image_url, createdAt: 'Publicado', likes: p.likes_count || 0, comments: p.comments_count || 0,
          isLiked: false, postType: isVideo ? 'video' : (p.image_url ? 'image' : 'text'), feeling, location, workout };
      });
      setPosts(formatted);
    } catch (err) { if (__DEV__) console.error(err); } finally { setLoadingPosts(false); }
  };

  const handleNewPost = async (postData: any): Promise<void> => {
    if (!user) return;
    try {
      const dbContent = (postData.feeling || postData.location || postData.workout)
        ? JSON.stringify({ text: postData.content, feeling: postData.feeling, location: postData.location, workout: postData.workout })
        : postData.content;
      await supabase.from('posts').insert({ user_id: user.id, content: dbContent, image_url: postData.image }).select('*, profiles:user_id(name, avatar_url)').single();
      loadUserPosts();
    } catch (err) { /* silent */ }
  };

  const tabs = [
    { key: 'posts' as const, label: SECTION_TITLES.posts },
    { key: 'sobre' as const, label: SECTION_TITLES.about },
    { key: 'opcoes' as const, label: SECTION_TITLES.options },
  ];

  return (
    <ErrorBoundary screenName={screenName}>
      <ScrollView style={layout.screen} contentContainerStyle={[layout.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <View style={styles.headerIconWrap}><Ionicons name={headerIcon} size={20} color={COLORS.primary} /></View>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ProfileHero name={userName} email={userEmail} memberSince={memberSince} uri={profile?.avatar_url}
            onPressAvatar={handleUpdateAvatar} onEditName={() => setShowEditName(true)} stats={stats} />

          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity key={tab.key} style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]} onPress={() => setActiveTab(tab.key)}>
                <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'posts' && <ProfilePostsTab userName={userName} userAvatar={profile?.avatar_url} posts={posts} loadingPosts={loadingPosts} userId={user?.id} onOpenComposer={() => setShowCreatePost(true)} />}

          {activeTab === 'sobre' && (
            <View>
              {user?.id && <View style={layout.section}><MuscleMiniRadar userId={user.id} /></View>}
            </View>
          )}

          {activeTab === 'opcoes' && <ProfileOptionsTab themeMode={themeMode} setThemeMode={setThemeMode} signOut={signOut} isCreator={profile?.role === 'creator' || profile?.role === 'admin'} />}
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
  tabsContainer: { flexDirection: 'row', backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: 4, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  tabButton: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  tabButtonActive: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabButtonText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textMuted },
  tabButtonTextActive: { color: COLORS.primary },
});
