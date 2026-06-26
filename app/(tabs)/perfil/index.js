// app/(tabs)/perfil/index.js
// Tela de Perfil - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { ProfileHeader, StatsGrid, PhysicalData, BadgesRow, WeightLogger, GamificationBar, AchievementsList } from '../../../src/components';
import { useAuth } from '../../../src/context/AuthContext';
import { supabase } from '../../../src/config/supabase';
import { getGamificationData } from '../../../src/services/gamification';
import { ACHIEVEMENTS } from '../../../src/constants/gamification';
import { layout, typography } from '../../../src/styles';

const defaultBadges = [{ id: '1', name: 'Streak 5 dias', icon: 'flame', color: '#FF6B35' }, { id: '2', name: 'Primeiro treino', icon: 'trophy', color: '#FFD600' }, { id: '3', name: '10 treinos', icon: 'barbell', color: '#CCFF00' }];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ streak: 0, workouts: 0, time: 0, favorites: 0 });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: workouts } = await supabase.from('user_workouts').select('*, workouts(title, duration_minutes, duration)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);
      const { count: favCount } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const completed = workouts?.filter(w => w.completed).length || 0;
      const totalMinutes = workouts?.reduce((sum, w) => sum + (w.duration || w.workouts?.duration_minutes || w.workouts?.duration || 0), 0) || 0;
      const streak = calculateStreak(workouts || []);

      setProfile(profileData);
      setStats({ streak, workouts: completed, time: Math.round(totalMinutes / 60), favorites: favCount || 0 });
      setRecentWorkouts(workouts?.map(w => ({
        id: w.id,
        name: w.workouts?.title || 'Treino',
        date: formatDate(w.completed_at || w.created_at),
        duration: w.duration || w.workouts?.duration_minutes || w.workouts?.duration || 0,
      })) || []);
      setGamification(await getGamificationData(user.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const userName = user?.user_metadata?.name || profile?.name || 'Atleta';
  const userEmail = user?.email || profile?.email;
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '24/01/2026';
  const physicalData = profile?.physical_data || { height: 178, weight: 82, age: 28, imc: 25.9 };

  const pickImage = async (cam) => {
    const perm = cam ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Aviso', 'Permissão necessária');
    const res = cam 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      const { error } = await supabase.from('profiles').update({ avatar_url: uri }).eq('id', user.id);
      if (!error) setProfile(prev => ({ ...prev, avatar_url: uri }));
      else Alert.alert('Erro', 'Erro ao salvar avatar');
    }
  };

  const handleUpdateAvatar = () => {
    Alert.alert('Foto de Perfil', 'Escolha a origem:', [
      { text: 'Câmera', onPress: () => pickImage(true) },
      { text: 'Galeria', onPress: () => pickImage(false) },
      { text: 'Cancelar', style: 'cancel' }
    ]);
  };

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
      <View style={layout.header}>
        <Text style={typography.h2}>Meu Perfil</Text>
        <TouchableOpacity onPress={() => Alert.alert('Editar', 'Em breve!')}>
          <Ionicons name="create-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ProfileHeader name={userName} email={userEmail} memberSince={memberSince} uri={profile?.avatar_url} onPressAvatar={handleUpdateAvatar} />
      <StatsGrid stats={stats} />

      {gamification && <GamificationBar xp={gamification.totalXP} />}

      <View style={layout.section}>
        <Text style={typography.label}>CONQUISTAS</Text>
        <AchievementsList achievements={gamification?.achievements || []} totalAchievements={ACHIEVEMENTS.length} />
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>DADOS FÍSICOS</Text>
        <PhysicalData data={physicalData} />
      </View>

      <WeightLogger />

      <View style={layout.section}>
        <View style={layout.sectionHeader}>
          <Text style={typography.label}>TREINOS RECENTES</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/perfil/history')}>
            <Text style={typography.bodySmall}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {recentWorkouts.length > 0 ? recentWorkouts.map((w) => (
          <View key={w.id} style={styles.workoutItem}>
            <View style={styles.workoutIcon}><Ionicons name="barbell" size={20} color={COLORS.primary} /></View>
            <View style={styles.workoutInfo}>
              <Text style={typography.h5}>{w.name}</Text>
              <Text style={typography.caption}>{w.date} • {w.duration} min</Text>
            </View>
          </View>
        )) : (
          <Text style={typography.bodyMuted}>Nenhum treino recente</Text>
        )}
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>CONFIGURAÇÕES</Text>
        {[
          { icon: 'card-outline', label: 'Minha Assinatura', route: '/subscription' }, { icon: 'shield-checkmark-outline', label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd' },
          { icon: 'help-circle-outline', label: 'Ajuda', route: '/(tabs)/ajuda' }, { icon: 'information-circle-outline', label: 'Conheça-nos', route: '/(tabs)/perfil/conheca-nos' },
          { icon: 'link-outline', label: 'Links e Redes Sociais', route: '/(tabs)/perfil/links' }, { icon: 'document-text-outline', label: 'Termos e Políticas', route: '/(tabs)/perfil/termos' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={() => router.push(item.route)}>
            <Ionicons name={item.icon} size={22} color={COLORS.textMuted} />
            <Text style={[typography.h5, { flex: 1, marginLeft: SPACING.md }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: signOut }])}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={[typography.h5, { color: COLORS.error }]}>Sair da conta</Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function calculateStreak(workouts) {
  const dates = [...new Set(workouts.filter(w => w.completed && w.completed_at).map(w => new Date(w.completed_at).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = dates.length ? 1 : 0;
  for (let i = 1; i < dates.length; i++) {
    if ((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000 === 1) streak++;
    else break;
  }
  return streak;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Sem data';
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  return diff === 0 ? 'Hoje' : diff === 1 ? 'Ontem' : diff < 7 ? `${diff} dias atrás` : new Date(dateStr).toLocaleDateString('pt-BR');
}

const styles = StyleSheet.create({
  workoutItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  workoutIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  workoutInfo: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30' },
});
