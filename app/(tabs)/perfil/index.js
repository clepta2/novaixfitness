import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { ProfileHero, WeightLogger, EditNameModal, OfflineSettings, TutorialOverlay, ErrorBoundary } from '../../../src/components';
import { useTutorial } from '../../../src/hooks/useTutorial';
import MuscleMiniRadar from '../../../src/components/profile/MuscleMiniRadar';
import { useAuth } from '../../../src/context/AuthContext';
import { useTheme } from '../../../src/context/ThemeContext';
import { supabase } from '../../../src/config/supabase';
import { layout, typography } from '../../../src/styles';
import { THEME_OPTIONS } from '../../../src/data/settingsOptions';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ streak: 0, workouts: 0, time: 0, favorites: 0 });
  const [showEditName, setShowEditName] = useState(false);
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('perfil', true);

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
    } catch (err) { if (__DEV__) console.error(err); }
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
    } catch { Alert.alert('Erro', 'Não foi possível salvar'); }
  };

  const quickLinks = [
    { icon: 'notifications-outline', color: COLORS.attention, label: 'Notificações', route: '/notifications' },
    { icon: 'card-outline', color: COLORS.secondary, label: 'Assinatura', route: '/subscription' },
    { icon: 'download-outline', color: COLORS.success, label: 'Exportar Dados', route: '/export-data' },
    { icon: 'shield-checkmark-outline', color: COLORS.info, label: 'Privacidade', route: '/(tabs)/perfil/lgpd' },
    { icon: 'help-circle-outline', color: COLORS.textMuted, label: 'Ajuda', route: '/(tabs)/ajuda' },
  ];

  return (
    <ErrorBoundary screenName="Conta">
    <ScrollView style={layout.screen} contentContainerStyle={[layout.scroll, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
      <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />

      <View style={layout.header}>
        <View style={{ width: 24 }} />
        <Ionicons name="person" size={22} color={COLORS.primary} />
        <View style={{ width: 24 }} />
      </View>

      <ProfileHero name={userName} email={userEmail} memberSince={memberSince} uri={profile?.avatar_url} onPressAvatar={handleUpdateAvatar} onEditName={() => setShowEditName(true)} stats={stats} />

      {user?.id && <View style={layout.section}><MuscleMiniRadar userId={user.id} /></View>}

      <WeightLogger />

      <View style={styles.section}>
        <Text style={typography.label}>APARÊNCIA</Text>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.key} style={[styles.themeBtn, themeMode === opt.key && styles.themeBtnActive]} onPress={() => setThemeMode(opt.key)}>
              <Ionicons name={opt.icon} size={20} color={themeMode === opt.key ? COLORS.background : COLORS.textMuted} />
              <Text style={[styles.themeBtnText, themeMode === opt.key && styles.themeBtnTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <OfflineSettings />

      <View style={styles.section}>
        <Text style={typography.label}>ATALHOS</Text>
        {quickLinks.map((link) => (
          <TouchableOpacity key={link.route} style={styles.quickLink} onPress={() => router.push(link.route)}>
            <Ionicons name={link.icon} size={20} color={link.color} />
            <Text style={styles.quickLinkText}>{link.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: signOut }])}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <EditNameModal visible={showEditName} onClose={() => setShowEditName(false)} initialName={userName} onSave={updateProfileName} />
    </ScrollView>
    </ErrorBoundary>
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
  section: { marginBottom: SPACING.xl },
  themeRow: { flexDirection: 'row', gap: SPACING.sm },
  themeBtn: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  themeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  themeBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.xs },
  themeBtnTextActive: { color: COLORS.background },
  quickLink: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  quickLinkText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '12', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.xl },
  logoutText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.error },
});
