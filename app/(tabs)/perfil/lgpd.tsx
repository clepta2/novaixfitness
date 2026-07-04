import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';
import { SPACING } from '../../../src/constants/spacing';
import { useAuth } from '../../../src/context/AuthContext';
import { layout, typography } from '../../../src/styles';
import {
  downloadUserData, deleteAccount,
  getConsentSettings, updateConsentSettings,
} from '../../../src/services/lgpd';
import { DataActions, ConsentToggles, RightsList, ErrorBoundary } from '../../../src/components';

export default function LGPDScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [consents, setConsents] = useState({ marketing: true, analytics: true, thirdParty: false });
  const [loading, setLoading] = useState(false);
  const [consentLoading, setConsentLoading] = useState(true);

  const loadConsents = useCallback(async () => {
    if (!user?.id) return;
    try {
      const settings = await getConsentSettings(user.id);
      if (settings) setConsents({ marketing: settings.marketing, analytics: settings.analytics, thirdParty: settings.thirdParty });
    } catch (err) { if (__DEV__) console.error('Erro ao carregar consentimentos:', err); }
    finally { setConsentLoading(false); }
  }, [user?.id]);

  useEffect(() => { loadConsents(); }, [loadConsents]);

  const handleExportData = async () => {
    if (!user?.id) return;
    Alert.alert('Exportar Dados', 'Você receberá um arquivo JSON com todos os seus dados pessoais.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Exportar', onPress: async () => {
        setLoading(true);
        try { await downloadUserData(user.id); Alert.alert('Sucesso', 'Dados exportados com sucesso!'); }
        catch (err) { Alert.alert('Erro', 'Não foi possível exportar: ' + err.message); }
        finally { setLoading(false); }
      }},
    ]);
  };

  const handleDeleteAccount = () => {
    if (!user?.id) return;
    Alert.alert('Excluir Minha Conta', 'Esta ação é IRREVERSÍVEL. Tem certeza absoluta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Continuar', style: 'destructive', onPress: () => {
        Alert.alert('Última Confirmação', 'Esta ação não pode ser desfeita.', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'DELETAR CONTA', style: 'destructive', onPress: async () => {
            setLoading(true);
            try { await deleteAccount(user.id); Alert.alert('Conta Deletada', 'Sua conta foi removida.', [{ text: 'OK', onPress: () => router.replace('/') }]); }
            catch (err) { Alert.alert('Erro', 'Não foi possível deletar: ' + err.message); }
            finally { setLoading(false); }
          }},
        ]);
      }},
    ]);
  };

  const handleConsentChange = async (type, value) => {
    if (!user?.id) return;
    const newSettings = { ...consents, [type]: value };
    setConsents(newSettings);
    try { await updateConsentSettings(user.id, newSettings); }
    catch { Alert.alert('Erro', 'Não foi possível salvar.'); loadConsents(); }
  };

  return (
    <ErrorBoundary screenName="LGPD">
      <View style={layout.screen}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={layout.header}>
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Voltar" accessibilityRole="button">
              <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
            <Text style={typography.h2}>Privacidade (LGPD)</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.subtitle}>Seus Dados, Seu Controle</Text>

          <DataActions onExport={handleExportData} onDelete={handleDeleteAccount} loading={loading} />
          <ConsentToggles values={consents} onChange={handleConsentChange} loading={consentLoading} />
          <RightsList />

          <View style={styles.footer}>
            <Text style={typography.caption}>DPO: dpo@novaixfitness.com</Text>
            <Text style={typography.caption}>Última atualização: 24/06/2026</Text>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  subtitle: { ...typography.subtitle, marginBottom: SPACING.xl },
  footer: { alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.lg },
});
