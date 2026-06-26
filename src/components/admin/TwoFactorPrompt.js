// src/components/admin/TwoFactorPrompt.js
// Prompt de verificação 2FA - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { verify2FA } from '../../services/totp';
import { typography } from '../../styles';

export default function TwoFactorPrompt({ userId, onVerified }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Erro', 'Digite o código de 6 dígitos.');
      return;
    }
    setLoading(true);
    try {
      const valid = await verify2FA(userId, code);
      if (valid) {
        onVerified();
      } else {
        Alert.alert('Erro', 'Código inválido ou expirado. Tente novamente.');
        setCode('');
      }
    } catch (err) {
      Alert.alert('Erro', 'Falha ao verificar código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={48} color={COLORS.primary} />
      <Text style={typography.h3}>VERIFICAÇÃO 2FA</Text>
      <Text style={typography.bodyMuted}>Digite o código do Google Authenticator</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="000000"
        placeholderTextColor={COLORS.textMuted}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />

      <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleVerify} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <>
            <Ionicons name="log-in" size={20} color={COLORS.background} />
            <Text style={styles.btnText}>VERIFICAR</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, gap: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderRadius: 8, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, color: COLORS.textTitle, fontSize: 28, fontFamily: 'Montserrat_700Bold', textAlign: 'center', letterSpacing: 10, width: '100%', marginTop: SPACING.lg },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.lg, width: '100%', marginTop: SPACING.lg },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 },
});
