import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { BRAND_NAME, APP_VERSION } from '../src/constants/brand';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { shareProgress } from '../src/services/share';
import { setVoiceCoachEnabled } from '../src/services/voiceCoach';
import { resetAllTutorials } from '../src/services/tutorial';
import { useTutorial } from '../src/hooks/useTutorial';
import { ProfileCard, SettingsGroup, MenuSection, OfflineSettings, TutorialOverlay } from '../src/components';
import BottomTabBar from '../src/components/ui/BottomTabBar';
import { THEME_OPTIONS, SETTINGS_GROUPS, ACCOUNT_OPTIONS, INFO_OPTIONS } from '../src/data/settingsOptions';
import { styles } from '../src/styles/settingsStyles';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    darkMode: true, autoPlay: true, soundEffects: true, hapticFeedback: true,
    showRestTimer: true, autoSkipRest: false, voiceCoach: true,
  });
  const { visible: tutorialVisible, steps: tutorialSteps, showTutorial: showTutorialModal, handleComplete, handleSkip } = useTutorial('home');

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const { data } = await supabase.from('profiles').select('name, email, app_settings').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        if (data.app_settings) { setSettings(data.app_settings); setVoiceCoachEnabled(data.app_settings.voiceCoach !== false); }
      }
    }
    load();
  }, [user?.id]);

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (key === 'voiceCoach') setVoiceCoachEnabled(newSettings.voiceCoach);
    await supabase.from('profiles').update({ app_settings: newSettings }).eq('id', user.id);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Deletar Conta', 'Esta acao e irreversivel.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        try {
          for (const t of ['user_workouts', 'favorites', 'posts', 'notifications', 'body_measurements', 'progress_photos', 'user_achievements']) {
            await supabase.from(t).delete().eq('user_id', user.id);
          }
          await supabase.from('profiles').delete().eq('id', user.id);
          await signOut();
          Alert.alert('Conta deletada', 'Sua conta foi removida.');
        } catch { Alert.alert('Erro', 'Nao foi possivel deletar a conta.'); }
      }},
    ]);
  };

  const handleAction = async (action) => {
    if (action === 'tutorial') { showTutorialModal(); }
    else if (action === 'password') {
      try {
        await supabase.auth.resetPasswordForEmail(user.email);
        Alert.alert('Email enviado', 'Verifique sua caixa de entrada para redefinir a senha.');
      } catch { Alert.alert('Erro', 'Nao foi possível enviar o email.'); }
    } else if (action === 'rate') {
      const { Linking } = require('react-native');
      const url = Platform.OS === 'ios' ? 'https://apps.apple.com/app/id000000000' : 'https://play.google.com/store/apps/details?id=com.novaix.fitness';
      Linking.openURL(url).catch(() => Alert.alert('Avaliar', 'Obrigado pela preferencia!'));
    } else if (action === 'share') {
      shareProgress({ streak: profile?.streak || 0, totalWorkouts: profile?.total_workouts || 0, totalMinutes: profile?.total_minutes || 0 });
    }
  };

  const handleMenuPress = (item) => {
    if (item.route) router.push(item.route);
    else if (!item.version) handleAction(item.action);
  };

  return (
    <View style={layout.screen}>
      <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Configurações</Text>
          <View style={{ width: 24 }} />
        </View>

        <ProfileCard profile={profile} onPress={() => router.push('/(tabs)/perfil')} />

        <View style={styles.themeSection}>
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

        {SETTINGS_GROUPS.map((g) => <SettingsGroup key={g.title} title={g.title} items={g.items} settings={settings} onToggle={handleToggle} />)}

        <OfflineSettings />

        <MenuSection title="CONTA" items={ACCOUNT_OPTIONS} onPress={handleMenuPress} />

        <View style={styles.tutorialSection}>
          <Text style={typography.label}>TUTORIAL</Text>
          <TouchableOpacity style={styles.replayBtn} onPress={async () => { await resetAllTutorials(user?.id); showTutorialModal(); }}>
            <Ionicons name="refresh" size={20} color={COLORS.primary} />
            <Text style={[typography.h5, { color: COLORS.primary }]}>Reassistir Tutorial</Text>
          </TouchableOpacity>
        </View>

        <MenuSection title="INFORMAÇÕES" items={INFO_OPTIONS} onPress={handleMenuPress} />

        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: signOut }])} accessibilityLabel="Sair da conta" accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={[typography.h5, { color: COLORS.error }]}>Sair da Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} accessibilityLabel="Deletar minha conta" accessibilityRole="button">
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
          <Text style={[typography.caption, { color: COLORS.textMuted }]}>Deletar minha conta</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={typography.caption}>{BRAND_NAME} v{APP_VERSION}</Text>
          <Text style={typography.caption}>Feito com dedicação</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
      <BottomTabBar activeTab="perfil" />
    </View>
  );
}
