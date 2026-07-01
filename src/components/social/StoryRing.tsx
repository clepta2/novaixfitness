// src/components/social/StoryRing.tsx
// Anel de Stories premium estilo Instagram/Facebook - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

interface StoryRingProps {
  currentUserId: string;
  currentUserAvatar?: string;
  currentUserName?: string;
  onViewStory: (story: any) => void;
  onAddStory: () => void;
}

export default function StoryRing({ currentUserId, currentUserAvatar, currentUserName, onViewStory, onAddStory }: StoryRingProps) {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStories(); }, [currentUserId]);

  const loadStories = async () => {
    if (!currentUserId) return;
    try {
      const { data } = await supabase
        .from('stories')
        .select('id, user_id, image_url, expires_at, profiles:user_id(name, avatar_url)')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      const grouped = (data || []).reduce((acc: any, story: any) => {
        if (!acc[story.user_id]) acc[story.user_id] = [];
        acc[story.user_id].push(story);
        return acc;
      }, {});

      // Filtrar stories para excluir os do próprio usuário logado se for o caso, ou marcar
      const storyList = Object.entries(grouped)
        .filter(([userId]) => userId !== currentUserId) // Exibir stories dos outros atletas
        .map(([userId, userStories]: any) => ({
          userId,
          name: userStories[0].profiles?.name || 'Atleta',
          avatar: userStories[0].profiles?.avatar_url,
          stories: userStories,
          seen: false,
        }));

      setStories(storyList);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar stories:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Card de Adicionar Story (Primeiro item - Usuário Logado) */}
        <TouchableOpacity style={styles.ring} onPress={onAddStory}>
          <View style={styles.myAvatarContainer}>
            <Image 
              source={currentUserAvatar ? { uri: currentUserAvatar } : require('../../../assets/images/avatar_placeholder.png')} 
              style={styles.avatar} 
            />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={14} color={COLORS.background} />
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>Seu Story</Text>
        </TouchableOpacity>

        {/* Stories dos Outros Atletas */}
        {stories.map(story => (
          <TouchableOpacity key={story.userId} style={styles.ring} onPress={() => onViewStory?.(story)}>
            <View style={[styles.avatarBorder, story.seen && styles.seen]}>
              <Image 
                source={story.avatar ? { uri: story.avatar } : require('../../../assets/images/avatar_placeholder.png')} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingVertical: SPACING.md, 
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: { paddingHorizontal: SPACING.lg },
  ring: { alignItems: 'center', marginRight: SPACING.md, width: 68 },
  myAvatarContainer: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  avatarBorder: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', padding: 2,
  },
  seen: { borderColor: COLORS.border },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surfaceOverlay },
  addBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.surface,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 3
  },
  name: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted, marginTop: 6, textAlign: 'center' },
});
