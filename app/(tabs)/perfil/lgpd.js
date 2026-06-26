// app/(tabs)/perfil/lgpd.js
// Tela de Privacidade (LGPD) - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { useAuth } from '../../../src/context/AuthContext';
import { layout, typography } from '../../../src/styles';
import {
  exportUserData,
  downloadUserData,
  deleteAccount,
  getConsentSettings,
  updateConsentSettings,
} from '../../../src/services/lgpd';

export default function LGPDScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [marketing, setMarketing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consentLoading, setConsentLoading] = useState(true);

  const loadConsents = useCallback(async () => {
    if (!user?.id) return;
    try {
      const settings = await getConsentSettings(user.id);
      if (settings) {
        setMarketing(settings.marketing);
        setAnalytics(settings.analytics);
        setThirdParty(settings.thirdParty);
      }
    } catch (err) {
      console.error('Erro ao carregar consentimentos:', err);
    } finally {
      setConsentLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadConsents(); }, [loadConsents]);

  const handleExportData = async () => {
    Alert.alert(
      'Exportar Dados',
      'Você receberá um arquivo JSON com todos os seus dados pessoais. Isso pode levar alguns segundos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Exportar',
          onPress: async () => {
            setLoading(true);
            try {
              await downloadUserData(user.id);
              Alert.alert('Sucesso', 'Dados exportados com sucesso!');
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível exportar os dados: ' + err.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Deletar Minha Conta',
      'Esta ação é IRREVERSÍVEL.\n\nTodos os seus dados serão permanentemente removidos:\n• Perfil e histórico\n• Treinos e favoritos\n• Posts e comentários\n• Conquistas e progresso\n• Assinatura (sem reembolso)\n\nTem certeza absoluta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Última Confirmação',
              'Digite "DELETAR" para confirmar.\n\nEsta ação não pode ser desfeita.',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'DELETAR CONTA',
                  style: 'destructive',
                  onPress: async () => {
                    setLoading(true);
                    try {
                      await deleteAccount(user.id);
                      Alert.alert('Conta Deletada', 'Sua conta foi permanentemente removida.', [
                        { text: 'OK', onPress: () => router.replace('/') },
                      ]);
                    } catch (err) {
                      Alert.alert('Erro', 'Não foi possível deletar a conta: ' + err.message);
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleConsentChange = async (type, value) => {
    const newSettings = {
      marketing: type === 'marketing' ? value : marketing,
      analytics: type === 'analytics' ? value : analytics,
      thirdParty: type === 'thirdParty' ? value : thirdParty,
    };

    if (type === 'marketing') setMarketing(value);
    if (type === 'analytics') setAnalytics(value);
    if (type === 'thirdParty') setThirdParty(value);

    try {
      await updateConsentSettings(user.id, newSettings);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar a preferência.');
      loadConsents();
    }
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Privacidade (LGPD)</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>Seus Dados, Seu Controle</Text>

        <View style={styles.section}>
          <Text style={typography.label}>GERENCIAR MEUS DADOS</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleExportData} disabled={loading}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.primary + '15' }]}>
                <Ionicons name="download-outline" size={22} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={typography.h5}>EXPORTAR DADOS</Text>
                <Text style={typography.caption}>Baixar arquivo JSON com todos os seus dados</Text>
              </View>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount} disabled={loading}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: COLORS.error + '15' }]}>
                <Ionicons name="trash-outline" size={22} color={COLORS.error} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.h5, { color: COLORS.error }]}>DELETAR MINHA CONTA</Text>
                <Text style={typography.caption}>Ação irreversível e permanente</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={typography.label}>CONSENTIMENTOS</Text>

          {consentLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ padding: SPACING.xl }} />
          ) : (
            <>
              <View style={styles.toggleItem}>
                <View style={styles.toggleInfo}>
                  <Text style={typography.h5}>Marketing</Text>
                  <Text style={typography.caption}>E-mails promocionais e novidades</Text>
                </View>
                <Switch
                  value={marketing}
                  onValueChange={(v) => handleConsentChange('marketing', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={marketing ? COLORS.background : COLORS.textMuted}
                />
              </View>

              <View style={styles.toggleItem}>
                <View style={styles.toggleInfo}>
                  <Text style={typography.h5}>Análise de Uso</Text>
                  <Text style={typography.caption}>Dados anônimos para melhorar o app</Text>
                </View>
                <Switch
                  value={analytics}
                  onValueChange={(v) => handleConsentChange('analytics', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={analytics ? COLORS.background : COLORS.textMuted}
                />
              </View>

              <View style={styles.toggleItem}>
                <View style={styles.toggleInfo}>
                  <Text style={typography.h5}>Terceiros</Text>
                  <Text style={typography.caption}>Compartilhar com parceiros analíticos</Text>
                </View>
                <Switch
                  value={thirdParty}
                  onValueChange={(v) => handleConsentChange('thirdParty', v)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={thirdParty ? COLORS.background : COLORS.textMuted}
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={typography.label}>SEUS DIREITOS (LGPD Art. 18)</Text>
          {[
            { icon: 'eye-outline', text: 'Acesso aos dados pessoais' },
            { icon: 'create-outline', text: 'Correção de dados incorretos' },
            { icon: 'download-outline', text: 'Portabilidade dos dados' },
            { icon: 'trash-outline', text: 'Eliminação dos dados pessoais' },
            { icon: 'close-circle-outline', text: 'Revogação do consentimento' },
            { icon: 'information-circle-outline', text: 'Informação sobre compartilhamento' },
          ].map((item, i) => (
            <View key={i} style={styles.rightItem}>
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              <Text style={typography.bodySmall}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={typography.caption}>DPO: dpo@novaixfitness.com</Text>
          <Text style={typography.caption}>Última atualização: 24/06/2026</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: 60 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginBottom: SPACING.xl },
  section: { marginBottom: SPACING.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  toggleInfo: { flex: 1, marginRight: SPACING.md },
  rightItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm },
  footer: { alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.lg },
});
