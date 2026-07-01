// @ts-nocheck
// app/index.tsx
// Tela de Login com animacoes de entrada - NOVAIX FITNESS


            ;
import { useMemo } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { BRAND_NAME } from '../src/constants/brand';
import { Button, AuthInput, ErrorBoundary } from '../src/components';
import { useTheme } from '../src/context/ThemeContext';
import useLogin from '../src/hooks/useLogin';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';

export default function LoginScreen() {
  const { isDark } = useTheme();
  const { isSmall } = useResponsive();
  const {
    router, email, setEmail, password, setPassword, loading,
    handleLogin, handleGoogle, handleApple, handleBiometrics,
    error,
  } = useLogin();

  // Animacoes de entrada
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(30), []);
  const logoScale = useMemo(() => new Animated.Value(0.8), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ErrorBoundary screenName="Login">
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground
        source={require('../assets/images/gym_interior.jpg')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={isDark ? [COLORS.background + 'CC', COLORS.background + 'F8'] : [COLORS.background + '90', COLORS.background + 'FA']}
          style={styles.gradient}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Logo com animacao */}
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
              <View style={styles.logoMark}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoLetter}>N</Text>
                  <View style={styles.arrows}>
                    <Ionicons name="arrow-up" size={14} color={COLORS.primary} />
                    <Ionicons name="arrow-down" size={14} color={COLORS.primary} />
                  </View>
                </View>
                <Text style={styles.logoSuffix}>ix</Text>
              </View>
            </Animated.View>

            {/* Brand com animacao */}
            <Animated.View style={[styles.brand, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.brandName}>{BRAND_NAME}</Text>
              <Text style={styles.brandTagline}>Sua Nova Evolucao no Treino</Text>
            </Animated.View>

            {/* Formulario com animacao */}
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <AuthInput 
                placeholder="E-mail ou CPF" 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                icon="mail-outline" 
                translucent={true} 
              />
              <AuthInput 
                placeholder="Senha" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
                icon="lock-closed-outline" 
                translucent={true} 
              />
              
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <TouchableOpacity 
                onPress={() => router.push('/forgot-password')} 
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <View style={styles.actionRow}>
                <View style={{ flex: 1 }}>
                  <Button title="ENTRAR" onPress={handleLogin} loading={loading} />
                </View>
                <TouchableOpacity 
                  style={styles.bioBtn} 
                  onPress={handleBiometrics}
                >
                  <Ionicons name="finger-print-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social buttons */}
              <TouchableOpacity style={styles.socialBtn} onPress={handleGoogle}>
                <Ionicons name="logo-google" size={20} color={COLORS.googleBlue} />
                <Text style={styles.socialBtnText}>Entrar com Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn} onPress={handleApple}>
                <Ionicons name="logo-apple" size={20} color={isDark ? "#FFF" : "#000"} />
                <Text style={styles.socialBtnText}>Entrar com Apple</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Footer com animacao */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Text style={styles.footerText}>Ainda nao tem conta? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
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
  gradient: { flex: 1 },
  scroll: { 
    flexGrow: 1, justifyContent: 'center', 
    padding: SPACING.xl, paddingBottom: 40,
  },

  // Logo
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoMark: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.primary,
  },
  logoLetter: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },
  arrows: { marginLeft: -2 },
  logoSuffix: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, marginLeft: 4 },

  // Brand
  brand: { alignItems: 'center', marginBottom: SPACING.massive },
  brandName: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 32, color: COLORS.primary, letterSpacing: 2 },
  brandTagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },

  // Form
  formContainer: { gap: SPACING.sm },
  errorContainer: { 
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.error + '15', padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.sm,
  },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.error, flex: 1 },
  forgotBtn: { alignSelf: 'flex-end', paddingVertical: SPACING.xs },
  forgotText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },

  // Action
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm },
  bioBtn: { 
    width: 50, height: 50, borderRadius: BORDER_RADIUS.md, 
    backgroundColor: COLORS.surface + 'CC', justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
  },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginHorizontal: SPACING.md },

  // Social
  socialBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, backgroundColor: COLORS.surface + 'CC', borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
  },
  socialBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xxl },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  footerLink: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
});
