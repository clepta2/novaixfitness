// app/forgot-password.js
// Tela de Recuperação de Senha - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendResetEmail = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    // Simular envio de e-mail
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Botão Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>

        {!sent ? (
          <>
            {/* Ícone */}
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={COLORS.primary} />
            </View>

            {/* Título */}
            <Text style={styles.title}>ESQUECEU A SENHA?</Text>
            <Text style={styles.subtitle}>
              Não se preocupe! Insira seu e-mail e enviaremos um link para redefinir sua senha.
            </Text>

            {/* Campo de E-mail */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="digite seu e-mail"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />
            </View>

            {/* Botão Enviar */}
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleSendResetEmail}>
              <Text style={styles.buttonPrimaryText}>ENVIAR LINK DE RECUPERAÇÃO</Text>
            </TouchableOpacity>

            {/* Link Voltar */}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backLink}>Voltar para o login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Ícone de Sucesso */}
            <View style={styles.iconContainer}>
              <Ionicons name="mail-open-outline" size={64} color={COLORS.success} />
            </View>

            {/* Título */}
            <Text style={styles.title}>E-MAIL ENVIADO!</Text>
            <Text style={styles.subtitle}>
              Enviamos um link de recuperação para{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            {/* Instruções */}
            <View style={styles.instructionsContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.instructionText}>Verifique sua caixa de entrada</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.instructionText}>Clique no link do e-mail</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.instructionText}>Crie uma nova senha</Text>
              </View>
            </View>

            {/* Botão Voltar ao Login */}
            <TouchableOpacity style={styles.buttonPrimary} onPress={() => router.back()}>
              <Text style={styles.buttonPrimaryText}>VOLTAR AO LOGIN</Text>
            </TouchableOpacity>

            {/* Reenviar */}
            <TouchableOpacity onPress={() => setSent(false)}>
              <Text style={styles.backLink}>Não recebeu? Reenviar e-mail</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emailHighlight: {
    color: COLORS.primary,
    fontFamily: 'Inter_500Medium',
  },
  inputContainer: {
    marginTop: 30,
    marginBottom: 20,
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
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  backLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 20,
  },
  instructionsContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  instructionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
  },
});
