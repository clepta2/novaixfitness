// Hook para lógica de cadastro - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { ALLOWED_DOMAINS } from '../data/allowedDomains';
import { validateCPF, formatCPF } from '../helpers/cpf';
import { COLORS } from '../constants/colors';

interface ModalState {
  show: boolean;
  title: string;
  content: string;
}

interface UseRegisterReturn {
  name: string;
  setName: (_val: string) => void;
  email: string;
  setEmail: (_val: string) => void;
  phone: string;
  setPhone: (_val: string) => void;
  cpf: string;
  setCpf: (_val: string) => void;
  password: string;
  setPassword: (_val: string) => void;
  confirm: string;
  setConfirm: (_val: string) => void;
  loading: boolean;
  modal: ModalState;
  setModal: (_val: ModalState) => void;
  strength: number;
  strengthLabel: string;
  strengthColor: string;
  passwordsMatch: boolean | null;
  emailTaken: boolean;
  cpfTaken: boolean;
  emailChecking: boolean;
  cpfChecking: boolean;
  isNameValid: boolean;
  isEmailFormatValid: boolean;
  isEmailValid: boolean;
  isCpfValid: boolean;
  isPhoneValid: boolean;
  accountBlocked: boolean;
  formatCPF: (_cpf: string) => string;
  formatPhone: (_v: string) => string;
  handleRegister: () => Promise<void>;
  showAlert: (_title: string, _msg: string, _onOk?: () => void) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

export function formatPhone(v: string): string {
  const c = v.replace(/\D/g, '').slice(0, 11);
  if (c.length <= 2) return c;
  if (c.length <= 7) return `(${c.slice(0, 2)}) ${c.slice(2)}`;
  return `(${c.slice(0, 2)}) ${c.slice(2, 7)}-${c.slice(7)}`;
}

export function validatePhone(p: string): boolean {
  const c = p.replace(/\D/g, '');
  return c.length === 10 || c.length === 11;
}

const WEAK_PASSWORDS: string[] = ['123456', '12345678', '123456789', 'password', 'senha123', 'novaix123', 'qwerty'];

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, signInWithApple } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalState>({ show: false, title: '', content: '' });
  const [strength, setStrength] = useState<number>(0);
  const [strengthLabel, setStrengthLabel] = useState<string>('');
  const [strengthColor, setStrengthColor] = useState<string>(COLORS.error);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [emailTaken, setEmailTaken] = useState<boolean>(false);
  const [cpfTaken, setCpfTaken] = useState<boolean>(false);
  const [emailChecking, setEmailChecking] = useState<boolean>(false);
  const [cpfChecking, setCpfChecking] = useState<boolean>(false);

  const isNameValid: boolean = name.trim().length > 0 && /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,}(\s+[a-zA-ZÀ-ÖØ-öø-ÿ\s]{2,})+$/.test(name.trim());
  const isEmailFormatValid: boolean = email.trim().length > 0 && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  const isEmailDomainAllowed: boolean = ALLOWED_DOMAINS.includes(email.trim().split('@')[1]?.toLowerCase());
  const isEmailValid: boolean = isEmailFormatValid && isEmailDomainAllowed;
  const isCpfValid: boolean = cpf.trim().length === 0 || validateCPF(cpf);
  const isPhoneValid: boolean = phone.trim().length === 0 || validatePhone(phone);
  const accountBlocked: boolean = emailTaken || cpfTaken;

  const showAlert = (title: string, msg: string, onOk?: () => void): void => {
    if (Platform.OS === 'web') { alert(`${title}: ${msg}`); if (onOk) onOk(); }
    else Alert.alert(title, msg, onOk ? [{ text: 'OK', onPress: onOk }] : undefined);
  };

  useEffect(() => { setPasswordsMatch(confirm ? password === confirm : null); }, [password, confirm]);

  useEffect(() => {
    if (!password) { setStrength(0); setStrengthLabel(''); return; }
    const score = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
    const isWeak = WEAK_PASSWORDS.includes(password.toLowerCase());
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
        const { data, error } = await supabase.rpc('does_cpf_exist', { check_cpf: cpf.replace(/\D/g, '') });
        if (!error) setCpfTaken(!!data);
      } catch { setCpfTaken(false); }
      finally { setCpfChecking(false); }
    }, 150);
    return () => clearTimeout(delay);
  }, [cpf, isCpfValid]);

  const handleRegister = async (): Promise<void> => {
    if (!isNameValid || !isEmailValid || password.length < 8 || password !== confirm) return showAlert('Erro', 'Corrija os erros no formulário.');
    if (accountBlocked) return showAlert('Erro', 'E-mail ou CPF já cadastrado.');
    setLoading(true);
    try {
      const userData: Record<string, string> = { name };
      if (cpf.trim()) userData.cpf = cpf.replace(/\D/g, '');
      if (phone.trim()) userData.phone = phone.replace(/\D/g, '');
      const res = await signUpWithEmail(email.trim(), password, userData);
      if (res?.session) router.replace('/(tabs)/home');
      else showAlert('Conta criada!', 'Verifique seu e-mail para confirmar.', () => router.replace('/'));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Falha ao criar conta';
      showAlert('Erro', msg);
    }
    finally { setLoading(false); }
  };

  return {
    name, setName, email, setEmail, phone, setPhone, cpf, setCpf,
    password, setPassword, confirm, setConfirm, loading,
    modal, setModal, strength, strengthLabel, strengthColor,
    passwordsMatch, emailTaken, cpfTaken, emailChecking, cpfChecking,
    isNameValid, isEmailFormatValid, isEmailValid, isCpfValid, isPhoneValid, accountBlocked,
    formatCPF, formatPhone, handleRegister, showAlert,
    signInWithGoogle: signInWithGoogle as any, signInWithApple: signInWithApple as any,
  };
}
