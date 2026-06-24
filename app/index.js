// app/index.js
// Tela de Login/Cadastro - NOVAIX FITNESS

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Nix</Text>
          <Text style={styles.brandName}>NOVAIX FITNESS</Text>
          <Text style={styles.tagline}>Sua Nova Evolução no Treino</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder="E-mail ou CPF"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Botão Principal */}
          <TouchableOpacity style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>
              {isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
            </Text>
          </TouchableOpacity>

          {/* Botões Sociais */}
          <TouchableOpacity style={styles.buttonGoogle}>
            <Ionicons name="logo-google" size={20} color="#000" />
            <Text style={styles.buttonSocialText}>Entrar com Google</Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.buttonApple}>
              <Ionicons name="logo-apple" size={20} color="#000" />
              <Text style={styles.buttonSocialText}>Entrar com Apple</Text>
            </TouchableOpacity>
          )}

          {/* Links */}
          <TouchableOpacity>
            <Text style={styles.link}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.link}>
              {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 64,
    color: COLORS.primary,
    marginBottom: 8,
  },
  brandName: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textDescription,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
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
    marginBottom: 12,
  },
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimaryText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.background,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonGoogle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  buttonApple: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  buttonSocialText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#000000',
  },
  link: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    marginTop: 16,
  },
});
