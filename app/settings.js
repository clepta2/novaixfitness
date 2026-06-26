// app/settings.js
// Tela de Configuracoes - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    darkMode: true,
    autoPlay: true,
    soundEffects: true,
    hapticFeedback: true,
    showRestTimer: true,
    autoSkipRest: false,
    weeklyReport: true,
    communityPosts: true,
  });

  useEffect(() => {
    async function load() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('name, email, app_settings')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data);
        if (data.app_settings) setSettings(data.app_settings);
      }
    }
    load();
  }, [user?.id]);

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await supabase
      .from('profiles')
      .update({ app_settings: newSettings })
      .eq('id', user.id);
  };

  const handleDeleteAccount = () => {
    Alert.alert('Deletar Conta', 'Esta acao e irreversivel. Todos os seus dados serao removidos permanentemente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: async () => {
          try {
            await supabase.from('user_workouts').delete().eq('user_id', user.id);
            await supabase.from('favorites').delete().eq('user_id', user.id);
            await supabase.from('posts').delete().eq('user_id', user.id);
            await supabase.from('notifications').delete().eq('user_id', user.id);
            await supabase.from('body_measurements').delete().eq('user_id', user.id);
            await supabase.from('progress_photos').delete().eq('user_id', user.id);
            await supabase.from('user_achievements').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);
            await signOut();
            Alert.alert('Conta deletada', 'Sua conta foi removida.');
          } catch (err) {
            Alert.alert('Erro', 'Nao foi possivel deletar a conta.');
          }
        },
      },
    ]);
  };

  const settingsGroups = [
    {
      title: 'APARENCIA',
      items: [
        { key: 'darkMode', icon: 'moon-outline', label: 'Modo Escuro', desc: 'Tema escuro do aplicativo' },
      ],
    },
    {
      title: 'TREINO',
      items: [
        { key: 'autoPlay', icon: 'play-circle-outline', label: 'Auto-play Videos', desc: 'Reproduzir video automaticamente' },
        { key: 'showRestTimer', icon: 'timer-outline', label: 'Timer de Descanso', desc: 'Mostrar timer entre series' },
        { key: 'autoSkipRest', icon: 'play-skip-forward-outline', label: 'Auto-skip Descanso', desc: 'Pular descanso automaticamente' },
      ],
    },
    {
      title: 'FEEDBACK',
      items: [
        { key: 'soundEffects', icon: 'volume-high-outline', label: 'Efeitos Sonoros', desc: 'Sons ao completar exercicios' },
        { key: 'hapticFeedback', icon: 'phone-portrait-outline', label: 'Vibracao', desc: 'Vibracao ao interagir' },
      ],
    },
    {
      title: 'COMUNICACAO',
      items: [
        { key: 'weeklyReport', icon: 'mail-outline', label: 'Relatorio Semanal', desc: 'Receber resumo por e-mail' },
        { key: 'communityPosts', icon: 'chatbubbles-outline', label: 'Posts da Comunidade', desc: 'Notificar sobre novos posts' },
      ],
    },
  ];

  const accountOptions = [
    { icon: 'person-outline', label: 'Editar Perfil', route: '/(tabs)/perfil' },
    { icon: 'lock-closed-outline', label: 'Alterar Senha', action: 'password' },
    { icon: 'download-outline', label: 'Exportar Dados', route: '/export-data' },
    { icon: 'shield-checkmark-outline', label: 'Privacidade (LGPD)', route: '/(tabs)/perfil/lgpd' },
  ];

  const infoOptions = [
    { icon: 'help-circle-outline', label: 'Ajuda', route: '/(tabs)/ajuda' },
    { icon: 'star-outline', label: 'Avaliar o App', action: 'rate' },
    { icon: 'share-social-outline', label: 'Compartilhar', action: 'share' },
    { icon: 'document-text-outline', label: 'Termos de Uso', route: '/(tabs)/perfil/termos' },
    { icon: 'information-circle-outline', label: 'Sobre', version: '1.0.0' },
  ];

  const handleAction = (action) => {
    switch (action) {
      case 'password':
        Alert.alert('Alterar Senha', 'Um link de redefinicao sera enviado para seu e-mail.');
        break;
      case 'rate':
        Alert.alert('Avaliar', 'Obrigado pela preferencia!');
        break;
      case 'share':
        Alert.alert('Compartilhar', 'Convite copiado!');
        break;
    }
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Configuracoes</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Perfil */}
        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/(tabs)/perfil')}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>
              {(profile?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={typography.h5}>{profile?.name || 'Usuario'}</Text>
            <Text style={typography.caption}>{profile?.email || ''}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Groups de configuracoes */}
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.section}>
            <Text style={typography.label}>{group.title}</Text>
            {group.items.map((item) => (
              <View key={item.key} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon} size={20} color={COLORS.primary} />
                  <View style={styles.settingInfo}>
                    <Text style={typography.h5}>{item.label}</Text>
                    <Text style={typography.caption}>{item.desc}</Text>
                  </View>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => handleToggle(item.key)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={settings[item.key] ? COLORS.background : COLORS.textMuted}
                />
              </View>
            ))}
          </View>
        ))}

        {/* Conta */}
        <View style={styles.section}>
          <Text style={typography.label}>CONTA</Text>
          {accountOptions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => item.route ? router.push(item.route) : handleAction(item.action)}
            >
              <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              <Text style={[typography.h5, { flex: 1 }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Informacoes */}
        <View style={styles.section}>
          <Text style={typography.label}>INFORMACOES</Text>
          {infoOptions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => item.route ? router.push(item.route) : item.version ? null : handleAction(item.action)}
            >
              <Ionicons name={item.icon} size={20} color={COLORS.primary} />
              <Text style={[typography.h5, { flex: 1 }]}>{item.label}</Text>
              {item.version ? (
                <Text style={typography.caption}>v{item.version}</Text>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sair e Deletar */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => Alert.alert('Sair', 'Tem certeza?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: signOut },
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
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  profileInitials: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.background },
  profileInfo: { flex: 1 },
  section: { marginBottom: SPACING.xl },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  settingInfo: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.error + '30', marginBottom: SPACING.md },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md },
  footer: { alignItems: 'center', gap: 4, marginTop: SPACING.xl },
});
