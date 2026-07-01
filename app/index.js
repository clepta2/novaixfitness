// app/index.js
// Tela de Login - NOVAIX FITNESS

import { useState, useCallback, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { BRAND_NAME } from '../src/constants/brand';
import { Button, AuthInput, SocialButton, ErrorBoundary } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { supabase } from '../src/config/supabase';
import { layout, typography } from '../src/styles';
import { canAttemptLogin, recordFailedLogin, recordSuccessfulLogin } from '../src/services/security/authProtection';
import { useScreenLimits } from '../src/hooks/useScreenLimits';

export default function LoginScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams();
  const { signInWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { checkLimit } = useScreenLimits('login');

  useEffect(() => {
    if (paramEmail) setEmail(paramEmail);
  }, [paramEmail]);

  const showAlert = (title, msg) => {
    if (Platform.OS === 'web') alert(`${title}: ${msg}`);
    else Alert.alert(title, msg);
  };

  const handleLogin = useCallback(async () => {
    const inputVal = email.trim();
    if (!inputVal) return showAlert('Erro', 'Insira seu E-mail ou CPF');
    if (!password.trim() || password.length < 6) return showAlert('Erro', 'Mínimo 6 caracteres');

    const loginCheck = checkLimit('submit');
    if (!loginCheck.allowed) {
      const mins = Math.ceil(loginCheck.retryAfterMs / 60000);
      return showAlert('Aguarde', `Muitas tentativas. Tente em ${mins} minuto(s).`);
    }

    const rateCheck = canAttemptLogin(inputVal);
    if (!rateCheck.allowed) {
      return showAlert('Aguarde', rateCheck.reason || 'Muitas tentativas');
    }

    setLoading(true);
    let resolvedEmail = inputVal;

    const cleanCpf = inputVal.replace(/\D/g, '');
    if (cleanCpf.length === 11 && /^\d+$/.test(cleanCpf)) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('cpf', cleanCpf)
          .maybeSingle();

        if (error) { if (__DEV__) console.warn('Erro ao buscar CPF no login:', error); }
        if (profile?.email) {
          resolvedEmail = profile.email;
        } else {
          setLoading(false);
          return showAlert('Erro', 'Nenhuma conta encontrada com este CPF.');
        }
      } catch (err) {
        if (__DEV__) console.warn('Erro ao processar login por CPF:', err);
      }
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(inputVal)) {
        setLoading(false);
        return showAlert('Erro', 'Formato de E-mail ou CPF inválido');
      }
    }

    try {
      await signInWithEmail(resolvedEmail, password);
      recordSuccessfulLogin(inputVal);
    } catch (e) {
      recordFailedLogin(inputVal);
      showAlert('Erro', e.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
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
        promptMessage: `Login Rápido - ${BRAND_NAME}`,
        fallbackLabel: 'Usar Senha',
      });
      if (result.success) {
        router.replace('/(tabs)/home');
      }
    } catch (_e) {
      showAlert('Erro', 'Falha na autenticação biométrica.');
    }
  }, [router]);

  return (
    <ErrorBoundary screenName="Login">
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground
        source={require('../assets/images/gym_interior.jpg')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={isDark ? ['rgba(18,22,26,0.6)', 'rgba(18,22,26,0.96)'] : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.97)']}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <View style={styles.logoMark}>
                <Text style={typography.brand}>N</Text>
                <View style={styles.arrows}><Ionicons name="arrow-up" size={16} color={COLORS.primary} /><Ionicons name="arrow-down" size={16} color={COLORS.primary} /></View>
              </View>
              <Text style={[typography.h3, { marginTop: 16 }]}>ix</Text>
            </View>

            <View style={styles.brand}>
              <Text style={typography.brand}>{BRAND_NAME}</Text>
              <Text style={typography.h5}>Sua Nova Evolução no Treino</Text>
            </View>

            <View>
              <AuthInput placeholder="E-mail ou CPF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" translucent={true} />
              <AuthInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" translucent={true} />
              <TouchableOpacity onPress={() => router.push('/forgot-password')} accessibilityLabel="Esqueceu a senha" accessibilityRole="button"><Text style={[typography.bodySmall, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>Esqueceu a senha?</Text></TouchableOpacity>
              <View style={{ height: SPACING.lg }} />
              <View style={styles.actionRow}>
                <View style={{ flex: 1 }}>
                  <Button title="ENTRAR" onPress={handleLogin} loading={loading} />
                </View>
                <TouchableOpacity style={[styles.bioBtn, { backgroundColor: isDark ? 'rgba(30, 35, 42, 0.55)' : 'rgba(241, 245, 249, 0.75)', borderColor: isDark ? 'rgba(255,255,255,0.12)' : COLORS.border }]} onPress={handleBiometrics}>
                  <Ionicons name="finger-print-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View style={layout.divider}><View style={[layout.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : COLORS.border }]} /><Text style={[layout.dividerText, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }]}>ou</Text><View style={[layout.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : COLORS.border }]} /></View>
              <SocialButton icon="google" iconColor={COLORS.googleBlue} label="Entrar com Google" onPress={handleGoogle} translucent={true} />
              <SocialButton icon="apple" iconColor={isDark ? "#FFF" : "#000"} label="Entrar com Apple" onPress={handleApple} translucent={true} />
            </View>

            <View style={styles.footer}>
              <Text style={typography.bodyMuted}>Ainda não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push('/register')} accessibilityLabel="Cadastrar-se" accessibilityRole="button"><Text style={typography.h4}>Cadastre-se</Text></TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingTop: layout.scroll.paddingTop, paddingBottom: 40 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  logoMark: { flexDirection: 'row', alignItems: 'center' },
  arrows: { marginLeft: -4 },
  brand: { alignItems: 'center', marginBottom: SPACING.massive },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  bioBtn: { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
});
