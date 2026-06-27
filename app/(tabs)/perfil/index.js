// app/(tabs)/perfil/index.js
// Tela de Perfil - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import {
  ProfileHero, AchievementsCarousel, QuickActionsGrid,
  ProfileMenuGroup, RankingCard, WeeklyChallenges, WeightLogger, EditNameModal,
  GamificationBar,
} from '../../../src/components';
import MuscleMiniRadar from '../../../src/components/profile/MuscleMiniRadar';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { getGamificationData } from '../../../src/services/gamification';
import { ACHIEVEMENTS } from '../../../src/constants/gamification';
import { layout, typography } from '../../../src/styles';
import { scale } from '../../../src/utils/responsive';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ streak: 0, workouts: 0, time: 0, favorites: 0 });
  const [gamification, setGamification] = useState(null);
  const [showEditName, setShowEditName] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: workouts } = await supabase.from('user_workouts').select('*, workouts(title, duration_minutes, duration)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
      const { count: favCount } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);

      const completed = workouts?.filter(w => w.completed).length || 0;
      const totalMinutes = workouts?.reduce((sum, w) => sum + (w.duration || w.workouts?.duration_minutes || 0), 0) || 0;
      const streak = calcStreak(workouts || []);

      setProfile(profileData);
      setStats({ streak, workouts: completed, time: Math.round(totalMinutes / 60), favorites: favCount || 0 });
      setGamification(await getGamificationData(user.id));
    } catch (err) {
      console.error(err);
    }
  }, [user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const userName = user?.user_metadata?.name || profile?.name || 'Atleta';
  const userEmail = user?.email || profile?.email || '';
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-';

  const handleUpdateAvatar = () => Alert.alert('Foto de Perfil', 'Escolha:', [
    { text: 'Câmera', onPress: () => pickImage(true) },
    { text: 'Galeria', onPress: () => pickImage(false) },
    { text: 'Cancelar', style: 'cancel' },
  ]);

  const pickImage = async (cam) => {
    const perm = cam ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = cam
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      await supabase.from('profiles').update({ avatar_url: uri }).eq('id', user.id);
      setProfile(prev => ({ ...prev, avatar_url: uri }));
    }
  };

  const updateProfileName = async (newName) => {
    try {
      await supabase.from('profiles').update({ name: newName }).eq('id', user.id);
      setProfile(prev => ({ ...prev, name: newName }));
    } catch (_e) {
      if (Platform.OS === 'web') alert('Erro ao salvar'); else Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  const confirmSignOut = () => Alert.alert('Sair', 'Tem certeza que deseja sair?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: signOut },
  ]);

  return (
    <ScrollView style={layout.screen} contentContainerStyle={[layout.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={layout.header}>
        <Text style={typography.h2}>Meu Perfil</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={layout.headerBtn}>
          <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Hero: avatar + stats + XP */}
      <ProfileHero
        name={userName}
        email={userEmail}
        memberSince={memberSince}
        uri={profile?.avatar_url}
        onPressAvatar={handleUpdateAvatar}
        onEditName={() => setShowEditName(true)}
        stats={stats}
        xp={gamification?.totalXP || 0}
      />

      {/* XP e Nível */}
      <GamificationBar xp={gamification?.totalXP || 0} />

      {/* Ações rápidas */}
      <QuickActionsGrid />

      {/* Mini Radar Muscular */}
      {user?.id && (
        <View style={layout.section}>
          <MuscleMiniRadar userId={user.id} />
        </View>
      )}

      {/* Conquistas em carrossel */}
      <AchievementsCarousel
        achievements={gamification?.achievements || []}
        totalAchievements={ACHIEVEMENTS.length}
      />

      {/* Desafios semanais + Ranking (compactos) */}
      {user?.id && (
        <View style={layout.section}>
          <WeeklyChallenges userId={user.id} />
        </View>
      )}
      {user?.id && (
        <View style={layout.section}>
          <RankingCard userId={user.id} />
        </View>
      )}

      {/* Peso */}
      <WeightLogger />

      {/* Menu agrupado e colapsável */}
      <ProfileMenuGroup />

      {/* Sair */}
      <TouchableOpacity style={styles.logoutBtn} onPress={confirmSignOut}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <EditNameModal visible={showEditName} onClose={() => setShowEditName(false)} initialName={userName} onSave={updateProfileName} />
    </ScrollView>
  );
}

function calcStreak(workouts) {
  const dates = [...new Set(workouts.filter(w => w.completed && w.completed_at).map(w => new Date(w.completed_at).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = dates.length ? 1 : 0;
  for (let i = 1; i < dates.length; i++) {
    if ((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

const styles = StyleSheet.create({
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '12', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.xl },
  logoutText: { fontFamily: 'Montserrat_600SemiBold', fontSize: scale(14), color: COLORS.error },
});
