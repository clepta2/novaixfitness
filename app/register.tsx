
// app/register.tsx
// Tela de Cadastro com animacoes de entrada - NOVAIX FITNESS


import { useMemo, useEffect , useRef} from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, AuthInput, ErrorBoundary } from '../src/components';
import { useTheme } from '../src/context/ThemeContext';
import { useRegister } from '../src/hooks/useRegister';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout } from '../src/styles';

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { isSmall } = useResponsive();
  const {
    name, setName, email, setEmail,
    password, setPassword, confirm, setConfirm, loading,
    strength, strengthLabel, strengthColor,
    passwordsMatch, isNameValid, isEmailValid,
    handleRegister, signInWithGoogle, signInWithApple,
  } = useRegister();

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ErrorBoundary screenName="Register">
      <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ImageBackground source={require('../assets/images/gym_interior.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="cover">
          <LinearGradient colors={isDark ? [COLORS.background + 'CC', COLORS.background + 'F8'] : [COLORS.background + '90', COLORS.background + 'FA']} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {/* Header com animacao */}
              <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>N</Text>
                </View>
                <Text style={styles.brandName}>NOVAIX</Text>
                <Text style={styles.brandSubtitle}>CRIE SUA CONTA</Text>
              </Animated.View>

              {/* Formulario com animacao */}
              <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <AuthInput label="NOME" placeholder="digite seu nome completo" value={name} onChangeText={(v: string) => setName(v.replace(/[^a-zA-Z\s]/g, ''))} autoCapitalize="words" icon="person-outline" translucent={true} />
                {name.length > 0 && (
                  <View style={styles.validationRow}>
                    <Ionicons name={isNameValid ? 'checkmark-circle' : 'close-circle'} size={14} color={isNameValid ? COLORS.primary : COLORS.error} />
                    <Text style={[styles.validationText, { color: isNameValid ? COLORS.primary : COLORS.error }]}>
                      {isNameValid ? 'Nome valido' : 'Insira nome e sobrenome'}
                    </Text>
                  </View>
                )}

                <AuthInput label="E-MAIL" placeholder="digite seu melhor e-mail" value={email} onChangeText={(v: string) => setEmail(v.replace(/[^a-zA-Z0-9@._+-]/g, '').slice(0, 80))} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" translucent={true} />
                {email.length > 0 && (
                  <View style={styles.validationRow}>
                    <Ionicons name={isEmailValid ? 'checkmark-circle' : 'close-circle'} size={14} color={isEmailValid ? COLORS.primary : COLORS.error} />
                    <Text style={[styles.validationText, { color: isEmailValid ? COLORS.primary : COLORS.error }]}>
                      {isEmailValid ? 'E-mail valido' : 'E-mail invalido'}
                    </Text>
                  </View>
                )}

                <AuthInput label="SENHA" placeholder="digite sua senha" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" translucent={true} />
                {password.length > 0 && (
                  <View style={styles.strengthSection}>
                    <View style={styles.strengthBar}>
                      <View style={[styles.strengthFill, { width: `${(strength / 5) * 100}%`, backgroundColor: strengthColor }]} />
                    </View>
                    <Text style={[styles.strengthLabel, { color: strengthColor }]}>{strengthLabel}</Text>
                    <View style={styles.strengthChecks}>
                      {[
                        ['Minimo 8 caracteres', password.length >= 8],
                        ['Maiuscula (A-Z)', /[A-Z]/.test(password)],
                        ['Minuscula (a-z)', /[a-z]/.test(password)],
                        ['Numero (0-9)', /[0-9]/.test(password)],
                        ['Simbolo (@, #, !)', /[^A-Za-z0-9]/.test(password)],
                      ].map(([lbl, ok]) => (
                        <View key={lbl} style={styles.checkRow}>
                          <Ionicons name={ok ? 'checkmark-circle' : 'ellipse-outline'} size={12} color={ok ? COLORS.primary : COLORS.textMuted} />
                          <Text style={[styles.checkText, { color: ok ? COLORS.primary : COLORS.textMuted }]}>{lbl}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <AuthInput label="CONFIRMAR SENHA" placeholder="confirme sua senha" value={confirm} onChangeText={setConfirm} secureTextEntry icon="lock-closed-outline" translucent={true} />
                {confirm.length > 0 && (
                  <View style={styles.validationRow}>
                    <Ionicons name={passwordsMatch ? 'checkmark-circle' : 'close-circle'} size={14} color={passwordsMatch ? COLORS.success : COLORS.error} />
                    <Text style={[styles.validationText, { color: passwordsMatch ? COLORS.success : COLORS.error }]}>
                      {passwordsMatch ? 'Senhas coincidem' : 'Senhas nao coincidem'}
                    </Text>
                  </View>
                )}

                {/* Botao cadastrar */}
                <View style={styles.btnWrap}>
                  <Button title="CADASTRAR E CONTINUAR" onPress={handleRegister} loading={loading} size={isSmall ? 'md' : 'lg'} style={{ width: '100%' }} />
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social buttons */}
                <TouchableOpacity style={styles.socialBtn} onPress={signInWithGoogle}>
                  <Ionicons name="logo-google" size={20} color={COLORS.googleBlue} />
                  <Text style={styles.socialBtnText}>Cadastrar com Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={signInWithApple}>
                  <Ionicons name="logo-apple" size={20} color={isDark ? '#FFF' : '#000'} />
                  <Text style={styles.socialBtnText}>Cadastrar com Apple</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={styles.footerText}>Ja tem conta? </Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={styles.footerLink}>Entrar</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </LinearGradient>
        </ImageBackground>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary, marginBottom: SPACING.md },
  logoText: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },
  brandName: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary, letterSpacing: 2 },
  brandSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  formContainer: { gap: SPACING.sm },
  validationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },
  validationText: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  strengthSection: { marginBottom: SPACING.md },
  strengthBar: { height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs },
  strengthFill: { height: '100%', borderRadius: 3 },
  strengthLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, marginBottom: SPACING.xs },
  strengthChecks: { gap: 4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkText: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  btnWrap: { marginTop: SPACING.md },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginHorizontal: SPACING.md },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface + 'CC', borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  socialBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xxl },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
});
