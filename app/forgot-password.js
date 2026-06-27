// app/forgot-password.js
// Tela de Recuperação de Senha - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, Input, Header } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Insira um e-mail válido');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao enviar e-mail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header showBack title="" />
      <View style={layout.scroll}>
        {!sent ? (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={COLORS.primary} />
            </View>
            <Text style={typography.h3}>ESQUECEU A SENHA?</Text>
            <Text style={typography.bodyMuted}>Não se preocupe! Insira seu e-mail e enviaremos um link para redefinir sua senha.</Text>
            <View style={{ height: SPACING.xl }} />
            <Input label="E-MAIL" placeholder="digite seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
            <Button title="ENVIAR LINK DE RECUPERAÇÃO" onPress={handleSendResetEmail} loading={loading} />
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={typography.bodyMuted}>Voltar para o login</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-open-outline" size={64} color={COLORS.success} />
            </View>
            <Text style={typography.h3}>E-MAIL ENVIADO!</Text>
            <Text style={typography.bodyMuted}>Enviamos um link de recuperação para{'\n'}<Text style={styles.emailHighlight}>{email}</Text></Text>
            <View style={styles.instructions}>
              {['Verifique sua caixa de entrada', 'Clique no link do e-mail', 'Crie uma nova senha'].map((text, i) => (
                <View key={i} style={styles.instructionItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={typography.bodySmall}>{text}</Text>
                </View>
              ))}
            </View>
            <Button title="VOLTAR AO LOGIN" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
            <TouchableOpacity onPress={() => setSent(false)}><Text style={typography.bodyMuted}>Não recebeu? Reenviar e-mail</Text></TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: 'center', marginBottom: SPACING.xxl },
  emailHighlight: { color: COLORS.primary },
  instructions: { marginTop: 30, marginBottom: 30, gap: 12 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
