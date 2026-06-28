import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, AuthInput, Header } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { layout, typography } from '../src/styles';

export default function ForgotPasswordScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paramEmail) setEmail(paramEmail);
  }, [paramEmail]);

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
      <ImageBackground
        source={require('../assets/images/gym_interior.jpg')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        <LinearGradient
          colors={isDark ? ['rgba(18,22,26,0.6)', 'rgba(18,22,26,0.96)'] : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.97)']}
          style={{ flex: 1 }}
        >
          <Header showBack title="" />
          <View style={[layout.scroll, styles.content]}>
            {!sent ? (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons name="lock-closed-outline" size={64} color={COLORS.primary} />
                </View>
                <Text style={[typography.h3, { color: isDark ? '#FFFFFF' : '#0F172A', textAlign: 'center' }]}>ESQUECEU A SENHA?</Text>
                <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: SPACING.sm }]}>Não se preocupe! Insira seu e-mail e enviaremos um link para redefinir sua senha.</Text>
                <View style={{ height: SPACING.xl }} />
                <AuthInput label="E-MAIL" placeholder="digite seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" translucent={true} />
                <Button title="ENVIAR LINK DE RECUPERAÇÃO" onPress={handleSendResetEmail} loading={loading} />
                <TouchableOpacity style={{ marginTop: SPACING.lg, alignItems: 'center' }} onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={[typography.bodySmall, { color: COLORS.primary, fontFamily: 'Montserrat_700Bold' }]}>Voltar para o login</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail-open-outline" size={64} color={COLORS.success} />
                </View>
                <Text style={[typography.h3, { color: isDark ? '#FFFFFF' : '#0F172A', textAlign: 'center' }]}>E-MAIL ENVIADO!</Text>
                <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: SPACING.sm }]}>Enviamos um link de recuperação para{'\n'}<Text style={styles.emailHighlight}>{email}</Text></Text>
                <View style={styles.instructions}>
                  {['Verifique sua caixa de entrada', 'Clique no link do e-mail', 'Crie uma nova senha'].map((text, i) => (
                    <View key={i} style={styles.instructionItem}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                      <Text style={[typography.bodySmall, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{text}</Text>
                    </View>
                  ))}
                </View>
                <Button title="VOLTAR AO LOGIN" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
                <TouchableOpacity style={{ marginTop: SPACING.lg, alignItems: 'center' }} onPress={() => setSent(false)}><Text style={[typography.bodySmall, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }]}>Não recebeu? Reenviar e-mail</Text></TouchableOpacity>
              </>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.xl, justifyContent: 'center', flex: 1 },
  iconContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  emailHighlight: { color: COLORS.primary, fontFamily: 'Montserrat_700Bold' },
  instructions: { marginTop: 30, marginBottom: 30, gap: 12 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
