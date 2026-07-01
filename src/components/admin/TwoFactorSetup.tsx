// src/components/admin/TwoFactorSetup.js
// Configuração inicial de 2FA - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { setup2FA, confirm2FA } from '../../services/totp';
import { layout, typography } from '../../styles';

interface TwoFactorSetupProps {
  userId: string;
  onComplete: () => void;
}

export default function TwoFactorSetup({ userId, onComplete }: TwoFactorSetupProps): React.JSX.Element {
  const [secret, setSecret] = useState<string>('');
  const [uri, setUri] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<string>('loading');

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        const result = await setup2FA(userId);
        setSecret(result.secret);
        setUri(result.uri);
        setStep('show_secret');
      } catch (err: any) {
        Alert.alert('Erro', 'Falha ao iniciar configuração 2FA.');
      }
    }
    init();
  }, [userId]);

  const handleConfirm = async (): Promise<void> => {
    if (code.length !== 6) {
      Alert.alert('Erro', 'Digite o código de 6 dígitos.');
      return;
    }
    setLoading(true);
    try {
      await confirm2FA(userId, code);
      Alert.alert('Sucesso', '2FA configurado com sucesso!', [
        { text: 'OK', onPress: onComplete },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[typography.bodyMuted, { marginTop: SPACING.md }]}>Gerando chave secreta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
        <Text style={typography.h3}>CONFIGURAR 2FA</Text>
        <Text style={typography.bodyMuted}>Proteja o painel admin com autenticação em dois fatores</Text>
      </View>

      <View style={styles.step}>
        <Text style={typography.h5}>Passo 1: Copie a chave secreta</Text>
        <Text style={typography.bodySmall}>{`Abra o Google Authenticator e escolha "Inserir chave"`}</Text>
        <TouchableOpacity style={styles.secretBox} onPress={() => {
          try {
            const Clipboard = require('expo-clipboard');
            Clipboard.setStringAsync(secret);
            Alert.alert('Copiado!', 'Chave copiada para a área de transferência.');
          } catch { Alert.alert('Copiar', 'Selecione e copie a chave manualmente.'); }
        }} accessibilityLabel="Copiar chave secreta" accessibilityRole="button" accessibilityHint="Copia a chave 2FA para a área de transferência">
          <Text style={styles.secretText} selectable>{secret}</Text>
          <Ionicons name="copy" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.step}>
        <Text style={typography.h5}>Passo 2: Digite o código</Text>
        <Text style={typography.bodySmall}>Cole o código de 6 dígitos do Authenticator</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="number-pad"
          maxLength={6}
          accessibilityLabel="Código de verificação 2FA"
        />
      </View>

      <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleConfirm} disabled={loading} accessibilityLabel="Confirmar e ativar 2FA" accessibilityRole="button" accessibilityHint="Verifica o código e ativa a autenticação em dois fatores">
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
            <Text style={styles.btnText}>CONFIRMAR E ATIVAR</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  container: { padding: SPACING.xl },
  header: { alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xxl },
  step: { marginBottom: SPACING.xl },
  secretBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.sm },
  secretText: { flex: 1, fontFamily: 'monospace', fontSize: 14, color: COLORS.primary, letterSpacing: 2 },
  input: { backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textTitle, fontSize: 24, fontFamily: 'Montserrat_700Bold', textAlign: 'center', letterSpacing: 8, marginTop: SPACING.sm },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.lg },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
