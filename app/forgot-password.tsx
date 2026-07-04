
// app/forgot-password.tsx
// Recuperacao de senha com animacoes - NOVAIX FITNESS


import { useMemo, useState, useEffect , useRef} from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet, ImageBackground, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { Button, AuthInput, ErrorBoundary } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { useResponsive } from '../src/hooks/useResponsive';
import { layout, typography } from '../src/styles';

export default function ForgotPasswordScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { isSmall } = useResponsive();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSendResetEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Insira um e-mail valido');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao enviar e-mail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary screenName="ForgotPassword">
      <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ImageBackground source={require('../assets/images/gym_interior.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover">
          <LinearGradient colors={isDark ? [COLORS.background + 'CC', COLORS.background + 'F8'] : [COLORS.background + '90', COLORS.background + 'FA']} style={{ flex: 1 }}>
            <View style={[layout.scroll, styles.content]}>
              {/* Botao voltar */}
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
              </TouchableOpacity>

              <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                {!sent ? (
                  <>
                    {/* Icone animado */}
                    <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }] }]}>
                      <Ionicons name="lock-closed-outline" size={64} color={COLORS.primary} />
                    </Animated.View>

                    <Text style={styles.title}>Esqueceu a senha?</Text>
                    <Text style={styles.subtitle}>Insira seu e-mail e enviaremos um link para redefinir sua senha.</Text>

                    <AuthInput label="E-MAIL" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" translucent={true} />

                    <View style={styles.btnWrap}>
                      <Button title="ENVIAR LINK" onPress={handleSendResetEmail} loading={loading} size={isSmall ? 'md' : 'lg'} style={{ width: '100%' }} />
                    </View>
                  </>
                ) : (
                  <>
                    {/* Sucesso */}
                    <Animated.View style={[styles.iconContainer, { backgroundColor: COLORS.success + '15' }]}>
                      <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
                    </Animated.View>

                    <Text style={styles.title}>E-mail enviado!</Text>
                    <Text style={styles.subtitle}>Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.</Text>

                    <View style={styles.btnWrap}>
                      <Button title="VOLTAR PARA LOGIN" onPress={() => router.push('/')} size={isSmall ? 'md' : 'lg'} style={{ width: '100%' }} />
                    </View>
                  </>
                )}
              </Animated.View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', paddingBottom: 40 },
  backBtn: { position: 'absolute', top: SPACING.xl, left: SPACING.xl, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface + 'CC', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xxl },
  btnWrap: { marginTop: SPACING.md },
});
