// app/register.js
// Tela de Cadastro - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: dados, 2: confirmação

  const handleRegister = () => {
    // Validações
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome completo');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }
    if (!acceptTerms) {
      Alert.alert('Erro', 'Você precisa aceitar os termos de uso');
      return;
    }

    // Cadastro realizado
    Alert.alert(
      'Sucesso!',
      'Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/onboarding/objetivo'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CADASTRO</Text>
          <Text style={styles.subtitle}>CRIE SUA CONTA</Text>
          
          {/* Progresso */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressStep, styles.progressActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressActive]} />
          </View>
          <Text style={styles.progressText}>Etapa {step} de 2: {step === 1 ? 'Dados de Login' : 'Confirmação'}</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>NOME</Text>
            <TextInput
              style={styles.input}
              placeholder="digite seu nome completo"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* E-mail */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="digite seu melhor e-mail"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>SENHA</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="digite sua senha"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CONFIRMAR SENHA</Text>
            <TextInput
              style={styles.input}
              placeholder="digite sua senha novamente"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Termos */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
              {acceptTerms && <Ionicons name="checkmark" size={14} color={COLORS.background} />}
            </View>
            <Text style={styles.termsText}>
              Ao continuar, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </TouchableOpacity>

          {/* Botão Cadastrar */}
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
            <Text style={styles.buttonPrimaryText}>CADASTRAR E CONTINUAR</Text>
          </TouchableOpacity>

          {/* Link existente */}
          <TouchableOpacity style={styles.existingAccount}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textTitle} />
            <Text style={styles.existingAccountText}>OU USAR CONTA EXISTENTE</Text>
          </TouchableOpacity>

          {/* Link Login */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>
              Já tem conta? <Text style={styles.loginLinkBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: COLORS.textDescription,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  existingAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  existingAccountText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  loginLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 8,
  },
  loginLinkBold: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.textTitle,
  },
});
