// app/index.js
// Tela de Login - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, AuthInput, SocialButton } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title, msg) => {
    if (Platform.OS === 'web') alert(`${title}: ${msg}`);
    else Alert.alert(title, msg);
  };

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !email.includes('@')) return showAlert('Erro', 'Insira um e-mail válido');
    if (!password.trim() || password.length < 6) return showAlert('Erro', 'Mínimo 6 caracteres');
    setLoading(true);
    try { await signInWithEmail(email, password); }
    catch (e) { showAlert('Erro', e.message || 'Falha ao fazer login'); }
    finally { setLoading(false); }
  }, [email, password, signInWithEmail]);

  const handleGoogle = useCallback(async () => {
    try { await signInWithGoogle(); } catch (e) { showAlert('Erro', e.message); }
  }, [signInWithGoogle]);

  const handleApple = useCallback(async () => {
    try { await signInWithApple(); } catch (e) { showAlert('Erro', e.message); }
  }, [signInWithApple]);

  const handleBiometrics = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        return showAlert('Aviso', 'Autenticação biométrica não configurada no dispositivo.');
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login Rápido - NOVAIX FITNESS',
        fallbackLabel: 'Usar Senha',
      });
      if (result.success) {
        router.replace('/(tabs)/home');
      }
    } catch (e) {
      showAlert('Erro', 'Falha na autenticação biométrica.');
    }
  }, [router]);

  return (
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoMark}>
            <Text style={typography.brand}>N</Text>
            <View style={styles.arrows}><Ionicons name="arrow-up" size={16} color={COLORS.primary} /><Ionicons name="arrow-down" size={16} color={COLORS.primary} /></View>
          </View>
          <Text style={[typography.h3, { marginTop: 16 }]}>ix</Text>
        </View>

        <View style={styles.brand}>
          <Text style={typography.brand}>NOVAIX FITNESS</Text>
          <Text style={typography.h5}>Sua Nova Evolução no Treino</Text>
        </View>

        <View>
          <AuthInput placeholder="E-mail ou CPF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" />
          <AuthInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" />
          <TouchableOpacity onPress={() => router.push('/forgot-password')}><Text style={typography.bodySmall}>Esqueceu a senha?</Text></TouchableOpacity>
          <View style={{ height: SPACING.lg }} />
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <Button title="ENTRAR" onPress={handleLogin} loading={loading} />
            </View>
            <TouchableOpacity style={styles.bioBtn} onPress={handleBiometrics}>
              <Ionicons name="finger-print-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={layout.divider}><View style={layout.dividerLine} /><Text style={layout.dividerText}>ou</Text><View style={layout.dividerLine} /></View>
          <SocialButton icon="logo-google" iconColor="#4285F4" label="Entrar com Google" onPress={handleGoogle} />
          <SocialButton icon="logo-apple" iconColor="#FFF" label="Entrar com Apple" onPress={handleApple} />
        </View>

        <View style={styles.footer}>
          <Text style={typography.bodyMuted}>Ainda não tem conta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}><Text style={typography.h4}>Cadastre-se</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingTop: 80, paddingBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  logoMark: { flexDirection: 'row', alignItems: 'center' },
  arrows: { marginLeft: -4 },
  brand: { alignItems: 'center', marginBottom: SPACING.massive },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  bioBtn: { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
});
