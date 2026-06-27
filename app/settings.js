import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { shareProgress } from '../src/services/share';
import { setVoiceCoachEnabled } from '../src/services/voiceCoach';
import { getPrefsForSettings, setNotificationPref } from '../src/services/notificationPrefs';
import { completeTutorial, getTutorialSteps } from '../src/services/tutorial';
import { ProfileCard, SettingsGroup, MenuSection, OfflineSettings, TutorialOverlay } from '../src/components';

const SETTINGS_GROUPS = [
  { title: 'APARENCIA', items: [
    { key: 'darkMode', icon: 'moon-outline', label: 'Modo Escuro', desc: 'Tema escuro do aplicativo', color: '#8B5CF6' },
  ]},
  { title: 'TREINO', items: [
    { key: 'autoPlay', icon: 'play-circle-outline', label: 'Auto-play Videos', desc: 'Reproduzir video automaticamente', color: '#3B82F6' },
    { key: 'showRestTimer', icon: 'timer-outline', label: 'Timer de Descanso', desc: 'Mostrar timer entre series', color: '#F59E0B' },
    { key: 'autoSkipRest', icon: 'play-skip-forward-outline', label: 'Auto-skip Descanso', desc: 'Pular descanso automaticamente', color: '#06B6D4' },
    { key: 'voiceCoach', icon: 'mic-outline', label: 'Treinador por Voz', desc: 'Instrucoes de voz durante o treino', color: '#CCFF00' },
  ]},
  { title: 'FEEDBACK', items: [
    { key: 'soundEffects', icon: 'volume-high-outline', label: 'Efeitos Sonoros', desc: 'Sons ao completar exercicios', color: '#10B981' },
    { key: 'hapticFeedback', icon: 'phone-portrait-outline', label: 'Vibracao', desc: 'Vibracao ao interagir', color: '#F43F5E' },
  ]},
  { title: 'COMUNICACAO', items: [
    { key: 'weeklyReport', icon: 'mail-outline', label: 'Relatorio Semanal', desc: 'Receber resumo por e-mail', color: '#FBBF24' },
    { key: 'communityPosts', icon: 'chatbubbles-outline', label: 'Posts da Comunidade', desc: 'Notificar sobre novos posts', color: '#D946EF' },
  ]},
];

const ACCOUNT_OPTIONS = [
  { icon: 'person-outline', label: 'Editar Perfil', route: '/(tabs)/perfil', color: '#3B82F6' },
  { icon: 'lock-closed-outline', label: 'Alterar Senha', action: 'password', color: '#EF4444' },
  { icon: 'download-outline', label: 'Exportar Dados', route: '/export-data', color: '#10B981' },
  { icon: 'shield-checkmark-outline', label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd', color: '#6366F1' },
];

const INFO_OPTIONS = [
  { icon: 'help-circle-outline', label: 'Ajuda', route: '/(tabs)/ajuda', color: '#6B7280' },
  { icon: 'school-outline', label: 'Ver Tutorial', action: 'tutorial', color: '#CCFF00' },
  { icon: 'star-outline', label: 'Avaliar o App', action: 'rate', color: '#FBBF24' },
  { icon: 'share-social-outline', label: 'Compartilhar', action: 'share', color: '#3B82F6' },
  { icon: 'document-text-outline', label: 'Termos de Uso', route: '/(tabs)/perfil/termos', color: '#9CA3AF' },
  { icon: 'information-circle-outline', label: 'Sobre', version: '1.0.0', color: '#6B7280' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    darkMode: true, autoPlay: true, soundEffects: true, hapticFeedback: true,
    showRestTimer: true, autoSkipRest: false, voiceCoach: true, weeklyReport: true, communityPosts: true,
  });
  const [notifPrefs, setNotifPrefs] = useState({});
  const [notifGroups, setNotifGroups] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const { data } = await supabase.from('profiles').select('name, email, app_settings, notification_prefs').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        if (data.app_settings) { setSettings(data.app_settings); setVoiceCoachEnabled(data.app_settings.voiceCoach !== false); }
        if (data.notification_prefs) setNotifPrefs(data.notification_prefs);
      }
      setNotifGroups(getPrefsForSettings());
    }
    load();
  }, [user?.id]);

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (key === 'voiceCoach') setVoiceCoachEnabled(newSettings.voiceCoach);
    await supabase.from('profiles').update({ app_settings: newSettings }).eq('id', user.id);
  };

  const handleNotifToggle = async (key) => {
    const enabled = !notifPrefs[key];
    setNotifPrefs(prev => ({ ...prev, [key]: enabled }));
    await setNotificationPref(user.id, key, enabled);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Deletar Conta', 'Esta acao e irreversivel.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Deletar', style: 'destructive', onPress: async () => {
        try {
          for (const table of ['user_workouts', 'favorites', 'posts', 'notifications', 'body_measurements', 'progress_photos', 'user_achievements']) {
            await supabase.from(table).delete().eq('user_id', user.id);
          }
          await supabase.from('profiles').delete().eq('id', user.id);
          await signOut();
          Alert.alert('Conta deletada', 'Sua conta foi removida.');
        } catch { Alert.alert('Erro', 'Nao foi possivel deletar a conta.'); }
      }},
    ]);
  };

  const handleAction = async (action) => {
    if (action === 'tutorial') {
      if (user?.id) await completeTutorial(user.id);
      setShowTutorial(true);
    } else if (action === 'password') {
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
      <TutorialOverlay visible={showTutorial} steps={getTutorialSteps()} onComplete={() => setShowTutorial(false)} onSkip={() => setShowTutorial(false)} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Configuracoes</Text>
          <View style={{ width: 24 }} />
        </View>

        <ProfileCard profile={profile} onPress={() => router.push('/(tabs)/perfil')} />

        {SETTINGS_GROUPS.map((group) => (
          <SettingsGroup key={group.title} title={group.title} items={group.items} settings={settings} onToggle={handleToggle} />
        ))}

        {notifGroups.map((group) => (
          <SettingsGroup key={`notif-${group.title}`} title={group.title} items={group.items} settings={notifPrefs} onToggle={handleNotifToggle} />
        ))}

        <OfflineSettings />

        <MenuSection title="CONTA" items={ACCOUNT_OPTIONS} onPress={handleMenuPress} />
        <MenuSection title="INFORMACOES" items={INFO_OPTIONS} onPress={handleMenuPress} />

        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [
          { text: 'Cancelar', style: 'cancel' }, { text: 'Sair', style: 'destructive', onPress: signOut },
        ])}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={[typography.h5, { color: COLORS.error }]}>Sair da Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
          <Text style={[typography.caption, { color: COLORS.textMuted }]}>Deletar minha conta</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={typography.caption}>NOVAIX FITNESS v1.0.0</Text>
          <Text style={typography.caption}>Feito com dedicacao</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.errorBg, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.md },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md },
  footer: { alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl },
});
