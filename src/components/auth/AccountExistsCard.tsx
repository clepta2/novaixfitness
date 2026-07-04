import React from 'react';
// src/components/auth/AccountExistsCard.js
// Card exibido quando e-mail/CPF já cadastrado - NOVAIX FITNESS

import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { SocialButton } from '../index';

interface AccountExistsCardProps {
  type?: string;
  email?: string;
  onClear?: () => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
}

export default function AccountExistsCard({ type, email, onClear, onGoogleSignIn, onAppleSignIn }: AccountExistsCardProps) {
  const router = useRouter();

  return (
    <View style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.errorLight, borderRadius: 12, padding: 16, marginTop: 4, marginBottom: SPACING.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="warning-outline" size={22} color={COLORS.errorLight} />
        <Text style={{ color: COLORS.errorLight, fontSize: 15, fontFamily: 'Montserrat_700Bold' }}>
          {type === 'email' ? 'Este e-mail já está cadastrado' : 'Este CPF já está cadastrado'}
        </Text>
      </View>
      <Text style={{ color: '#AAA', fontSize: 13, marginBottom: 14 }}>Essa conta já existe. Escolha uma opção:</Text>

      <TouchableOpacity onPress={() => router.replace({ pathname: '/', params: { email: email?.trim() } })} style={{ backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 8 }} accessibilityLabel="Fazer login com senha" accessibilityRole="button">
        <Text style={{ color: COLORS.background, fontSize: 14, fontFamily: 'Montserrat_700Bold' }}>FAÇA LOGIN COM SENHA</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push({ pathname: '/forgot-password', params: { email: email?.trim() } })} style={{ borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 }} accessibilityLabel="Redefinir senha" accessibilityRole="button">
        <Text style={{ color: COLORS.primary, fontSize: 14, fontFamily: 'Montserrat_700Bold' }}>REDEFINIR SENHA</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#333' }} />
        <Text style={{ color: COLORS.textMuted, marginHorizontal: 10, fontSize: 12 }}>ou entre com</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: '#333' }} />
      </View>

      <SocialButton icon="google" iconColor={COLORS.googleBlue} label="Entrar com Google" onPress={onGoogleSignIn} />
      <SocialButton icon="apple" iconColor="#FFF" label="Entrar com Apple" onPress={onAppleSignIn} />

      <TouchableOpacity onPress={onClear} style={{ alignItems: 'center', marginTop: 10 }} accessibilityLabel={type === 'email' ? 'Usar outro e-mail' : 'Usar outro CPF'} accessibilityRole="button">
        <Text style={{ color: COLORS.primary, fontSize: 13, textDecorationLine: 'underline' }}>
          {type === 'email' ? 'Usar outro e-mail' : 'Usar outro CPF'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
