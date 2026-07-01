// app/settings/account.js
// Configurações da conta

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { ErrorBoundary } from '../../src/components';
import { useI18n } from '../../src/i18n';

export default function AccountScreen() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { name: name.trim() } });
    if (!error) {
      await supabase.from('profiles').update({ name: name.trim() }).eq('id', user.id);
      Alert.alert(t('common.success'), t('settings.nameUpdated'));
    } else {
      Alert.alert(t('common.error'), error.message);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      Alert.alert(t('common.error'), t('settings.passwordMinLength'));
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      Alert.alert(t('common.success'), t('settings.passwordChanged'));
      setCurrentPassword('');
      setNewPassword('');
    } else {
      Alert.alert(t('common.error'), error.message);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    Alert.alert(t('profile.logout'), t('settings.confirmSignOut'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('auth.logout'), style: 'destructive', onPress: () => supabase.auth.signOut() },
    ]);
  };

  return (
    <ErrorBoundary screenName="Account">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('settings.accountTitle')}</Text>
        <Text style={styles.subtitle}>{t('settings.accountSubtitle')}</Text>

        <Text style={styles.sectionTitle}>{t('settings.nameLabel')}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('settings.namePlaceholder')}
            placeholderTextColor={COLORS.textMuted}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateName} disabled={loading} accessibilityLabel={t('settings.saveName')} accessibilityRole="button">
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.emailLabel')}</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} value={email} editable={false} />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.changePasswordTitle')}</Text>
        <TextInput
          style={styles.inputFull}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder={t('settings.newPasswordPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
        />
        <TouchableOpacity style={styles.changeBtn} onPress={handleChangePassword} disabled={loading || !newPassword} accessibilityLabel={t('profile.changePassword')} accessibilityRole="button">
          <Text style={styles.changeBtnText}>{t('profile.changePassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} accessibilityLabel={t('profile.logout')} accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  inputRow: { flexDirection: 'row', gap: SPACING.sm },
  input: { flex: 1, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  inputFull: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.primary, width: 44, height: 44, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  changeBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginTop: SPACING.md },
  changeBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md, marginTop: SPACING.xxxl, borderWidth: 1, borderColor: COLORS.error, borderRadius: BORDER_RADIUS.md },
  signOutText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.error },
});
