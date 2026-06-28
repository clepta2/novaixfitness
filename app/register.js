// app/register.js
// Tela de Cadastro - COM NÚMERO DE TELEFONE

import { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, ImageBackground, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, AuthInput, AccountExistsCard } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';
import { supabase } from '../src/config/supabase';
import { TERMS_TEXT, PRIVACY_TEXT } from '../src/data/legal';
import { ALLOWED_DOMAINS } from '../src/data/allowedDomains';
import { validateCPF, formatCPF } from '../src/helpers/cpf';
import { layout, typography } from '../src/styles';
import { styles } from '../src/styles/registerStyles';

function formatPhone(v) {
  const c = v.replace(/\D/g, '').slice(0, 11);
  if (c.length <= 2) return c;
  if (c.length <= 7) return `(${c.slice(0,2)}) ${c.slice(2)}`;
  return `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}`;
}

function validatePhone(p) {
  const c = p.replace(/\D/g, '');
  return c.length === 10 || c.length === 11;
}

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', content: '' });
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState(COLORS.error);
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [emailTaken, setEmailTaken] = useState(false);
  const [cpfTaken, setCpfTaken] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [cpfChecking, setCpfChecking] = useState(false);

  const isNameValid = name.trim().length > 0 && /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,}(\s+[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,})+$/.test(name.trim());
  const isEmailFormatValid = email.trim().length > 0 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  const isEmailDomainAllowed = ALLOWED_DOMAINS.includes(email.trim().split('@')[1]?.toLowerCase());
  const isEmailValid = isEmailFormatValid && isEmailDomainAllowed;
  const isCpfValid = cpf.trim().length > 0 && validateCPF(cpf);
  const isPhoneValid = phone.trim().length > 0 && validatePhone(phone);
  const accountBlocked = emailTaken || cpfTaken;

  const showAlert = (title, msg, onOk) => {
    if (Platform.OS === 'web') { alert(`${title}: ${msg}`); if (onOk) onOk(); }
    else Alert.alert(title, msg, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  };

  useEffect(() => { setPasswordsMatch(confirm ? password === confirm : null); }, [password, confirm]);

  useEffect(() => {
    if (!password) return (setStrength(0), setStrengthLabel(''));
    const score = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    const isWeak = ['123456', '12345678', '123456789', 'password', 'senha123', 'novaix123', 'qwerty'].includes(password.toLowerCase());
    const fs = isWeak ? Math.max(1, score - 2) : score;
    setStrength(fs);
    setStrengthLabel(fs <= 1 ? 'Senha Fraca 🔴' : fs <= 3 ? 'Senha Média 🟡' : 'Senha Forte 🔥');
    setStrengthColor(fs <= 1 ? COLORS.errorLight : fs <= 3 ? COLORS.warning : COLORS.primary);
  }, [password]);

  useEffect(() => {
    if (!isEmailValid) { setEmailTaken(false); setEmailChecking(false); return; }
    setEmailChecking(true);
    const delay = setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc('does_email_exist', { check_email: email.trim() });
        if (!error) setEmailTaken(!!data);
      } catch { setEmailTaken(false); }
      finally { setEmailChecking(false); }
    }, 150);
    return () => clearTimeout(delay);
  }, [email, isEmailValid]);

  useEffect(() => {
    if (!isCpfValid) { setCpfTaken(false); setCpfChecking(false); return; }
    setCpfChecking(true);
    const delay = setTimeout(async () => {
      try {
        const c = cpf.replace(/\D/g, '');
        const { data, error } = await supabase.rpc('does_cpf_exist', { check_cpf: c });
        if (!error) setCpfTaken(!!data);
      } catch { setCpfTaken(false); }
      finally { setCpfChecking(false); }
    }, 150);
    return () => clearTimeout(delay);
  }, [cpf, isCpfValid]);

  const handleRegister = async () => {
    if (!isNameValid || !isEmailValid || !isCpfValid || !isPhoneValid || password.length < 8 || password !== confirm) return showAlert('Erro', 'Corrija os erros no formulário.');
    if (accountBlocked) return showAlert('Erro', 'E-mail ou CPF já cadastrado.');
    setLoading(true);
    try {
      const res = await signUpWithEmail(email.trim(), password, { name, cpf: cpf.replace(/\D/g, ''), phone: phone.replace(/\D/g, '') });
      if (res?.session) router.replace('/(tabs)/home');
      else showAlert('Conta criada!', 'Verifique seu e-mail para confirmar.', () => router.replace('/'));
    } catch (e) { showAlert('Erro', e.message || 'Falha ao criar conta'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ImageBackground source={require('../assets/images/gym_interior.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="cover">
        <LinearGradient colors={isDark ? ['rgba(18,22,26,0.6)', 'rgba(18,22,26,0.96)'] : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.97)']} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={typography.brand}>NOVAIX</Text>
              <Text style={[typography.label, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>CRIE SUA CONTA</Text>
            </View>
            <View>
              <AuthInput label="NOME" placeholder="digite seu nome completo" value={name} onChangeText={(v) => setName(v.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, ''))} autoCapitalize="words" icon="person-outline" translucent={true} />
              {name.length > 0 && <Text style={[styles.helperText, { color: isNameValid ? COLORS.primary : COLORS.errorLight, marginTop: -SPACING.xs, marginBottom: SPACING.md }]}>{isNameValid ? '✓ Nome completo válido' : '✗ Insira nome e sobrenome'}</Text>}

              <AuthInput label="E-MAIL" placeholder="digite seu melhor e-mail" value={email} onChangeText={(v) => setEmail(v.replace(/[^a-zA-Z0-9@._+-]/g, '').slice(0, 80))} keyboardType="email-address" autoCapitalize="none" icon="mail-outline" translucent={true} />
              {email.length > 0 && !emailTaken && (
                <Text style={[styles.helperText, { color: emailChecking ? (isDark ? 'rgba(255,255,255,0.5)' : COLORS.textMuted) : isEmailValid ? COLORS.primary : COLORS.errorLight, marginTop: -SPACING.xs, marginBottom: SPACING.md }]}>
                  {emailChecking ? '⚡ Verificando...' : isEmailValid ? '✓ E-mail válido' : !isEmailFormatValid ? '✗ E-mail inválido' : '✗ Domínio não permitido'}
                </Text>
              )}
              {emailTaken && <AccountExistsCard type="email" email={email} onClear={() => { setEmail(''); setEmailTaken(false); }} onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} />}

              <AuthInput label="TELEFONE" placeholder="(00) 00000-0000" value={phone} onChangeText={(v) => setPhone(formatPhone(v))} keyboardType="phone-pad" icon="call-outline" translucent={true} />
              {phone.length > 0 && (
                <Text style={[styles.helperText, { color: isPhoneValid ? COLORS.primary : COLORS.errorLight, marginTop: -SPACING.xs, marginBottom: SPACING.md }]}>
                  {isPhoneValid ? '✓ Telefone válido' : '✗ Telefone inválido'}
                </Text>
              )}

              <AuthInput label="CPF" placeholder="digite seu CPF" value={cpf} onChangeText={(v) => setCpf(formatCPF(v))} keyboardType="numeric" icon="card-outline" translucent={true} />
              {cpf.length > 0 && !cpfTaken && (
                <Text style={[styles.helperText, { color: cpfChecking ? (isDark ? 'rgba(255,255,255,0.5)' : COLORS.textMuted) : isCpfValid ? COLORS.primary : COLORS.errorLight, marginTop: -SPACING.xs, marginBottom: SPACING.md }]}>
                  {cpfChecking ? '⚡ Verificando...' : isCpfValid ? '✓ CPF válido' : '✗ CPF inválido'}
                </Text>
              )}
              {cpfTaken && <AccountExistsCard type="cpf" email={email} onClear={() => { setCpf(''); setCpfTaken(false); }} onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} />}

              {!accountBlocked && (<>
                <AuthInput label="SENHA" placeholder="digite sua senha" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" translucent={true} />
                {password.length > 0 && (
                  <View style={[styles.strengthWrap, { marginBottom: SPACING.md }]}>
                    <View style={styles.strengthBarBg}><View style={[styles.strengthBarFill, { width: `${(strength / 5) * 100}%`, backgroundColor: strengthColor }]} /></View>
                    <Text style={[styles.strengthText, { color: strengthColor, marginBottom: 6 }]}>{strengthLabel}</Text>
                    <View style={{ gap: 2 }}>
                      {[['Mínimo 8 caracteres', password.length >= 8], ['Maiúscula (A-Z)', /[A-Z]/.test(password)], ['Minúscula (a-z)', /[a-z]/.test(password)], ['Número (0-9)', /[0-9]/.test(password)], ['Símbolo (@, #, !)', /[^A-Za-z0-9]/.test(password)]].map(([lbl, ok]) => (
                        <Text key={lbl} style={{ fontSize: 11, color: ok ? COLORS.primary : (isDark ? 'rgba(255,255,255,0.4)' : COLORS.textMuted) }}>{ok ? '✓' : '○'} {lbl}</Text>
                      ))}
                    </View>
                  </View>
                )}
                <AuthInput label="CONFIRMAR SENHA" placeholder="confirme sua senha" value={confirm} onChangeText={setConfirm} secureTextEntry icon="lock-closed-outline" translucent={true} />
                {confirm.length > 0 && <Text style={[styles.strengthText, { color: passwordsMatch ? COLORS.success : COLORS.errorLight, marginTop: -SPACING.md, marginBottom: SPACING.md }]}>{passwordsMatch ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}</Text>}
                <Text style={[typography.caption, { textAlign: 'center', marginBottom: SPACING.xl, color: isDark ? 'rgba(255,255,255,0.7)' : COLORS.textMuted }]}>Ao continuar, concorde com nossos <Text style={{ color: COLORS.primary, fontFamily: 'Montserrat_700Bold' }} onPress={() => setModal({ show: true, title: 'TERMOS', content: TERMS_TEXT })}>Termos</Text> e <Text style={{ color: COLORS.primary, fontFamily: 'Montserrat_700Bold' }} onPress={() => setModal({ show: true, title: 'PRIVACIDADE', content: PRIVACY_TEXT })}>Privacidade</Text>.</Text>
                <Button title="CADASTRAR E CONTINUAR" onPress={handleRegister} loading={loading} />
              </>)}
            </View>
            <View style={styles.footer}><Text style={typography.bodyMuted}>Já tem conta? </Text><TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}><Text style={typography.h4}>Entrar</Text></TouchableOpacity></View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
      <Modal visible={modal.show} animationType="fade" transparent onRequestClose={() => setModal({ ...modal, show: false })}>
        <TouchableWithoutFeedback onPress={() => setModal({ ...modal, show: false })}>
          <View style={styles.modalBg}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalHeader}>{modal.title}</Text>
                <ScrollView style={styles.modalScroll}><Text style={styles.modalBody}>{modal.content}</Text></ScrollView>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setModal({ ...modal, show: false })}><Text style={styles.modalBtnText}>ENTENDI</Text></TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}

