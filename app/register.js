// app/register.js
// Tela de Cadastro - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, AuthInput } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const e = {};
    if (!name.trim()) e.name = 'Insira seu nome';
    if (!email.trim() || !email.includes('@')) e.email = 'E-mail inválido';
    if (!password.trim() || password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirm) e.confirm = 'Senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, email, password, confirm]);

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUpWithEmail(email, password, { name });
      Alert.alert('Conta criada!', 'Verifique seu e-mail.', [{ text: 'OK', onPress: () => router.replace('/') }]);
    } catch (error) { Alert.alert('Erro', error.message || 'Falha ao criar conta'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={typography.brand}>NOVAIX</Text>
          <Text style={typography.label}>CRIE SUA CONTA</Text>
        </View>

        <View>
          <AuthInput label="NOME" placeholder="digite seu nome" value={name} onChangeText={setName} autoCapitalize="words" icon="person-outline" error={errors.name} />
          <AuthInput label="E-MAIL" placeholder="digite seu melhor e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" error={errors.email} />
          <AuthInput label="SENHA" placeholder="digite sua senha" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" error={errors.password} />
          <AuthInput label="CONFIRMAR SENHA" placeholder="confirme sua senha" value={confirm} onChangeText={setConfirm} secureTextEntry icon="lock-closed-outline" error={errors.confirm} />

          <Text style={[typography.caption, { textAlign: 'center', marginBottom: SPACING.xl }]}>Ao continuar, concorde com nossos <Text style={typography.h5}>Termos</Text> e <Text style={typography.h5}>Privacidade</Text>.</Text>

          <Button title="CADASTRAR E CONTINUAR" onPress={handleRegister} loading={loading} />
          <View style={layout.divider}><View style={layout.dividerLine} /><Text style={layout.dividerText}>ou</Text><View style={layout.dividerLine} /></View>
          <Button title="Usar conta existente" variant="ghost" onPress={() => router.back()} />
        </View>

        <View style={styles.footer}>
          <Text style={typography.bodyMuted}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.back()}><Text style={typography.h4}>Entrar</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl, paddingTop: 80, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: SPACING.massive },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.xl },
});
