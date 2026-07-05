
// app/register-coach.js
// Tela de Inscrição/Registro de Coach (CREF / KYC) - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/spacing';
import { Header, ErrorBoundary } from '../src/components';
import { supabase } from '../src/config/supabase';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';

export default function RegisterCoachScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('fitness');
  const [cref, setCref] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user?.id) checkCoachStatus();
  }, [user?.id]);

  const checkCoachStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/coaches/status`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const data = await response.json();
      if (response.ok && data.coach) {
        setStatus(data.coach.status);
        setDisplayName(data.coach.display_name || '');
        setBio(data.coach.bio || '');
        setCategory(data.coach.category || 'fitness');
        setCref(data.coach.cref || '');
        setDocumentUrl(data.coach.document_url || '');
      }
    } catch (err: any) {
      console.warn('Erro ao carregar status do coach:', err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async () => {
    if (!displayName || !cref || !documentUrl) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/coaches/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          category,
          cref,
          document_url: documentUrl
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao registrar');

      Alert.alert('Sucesso', 'Solicitação de Coach enviada para análise!');
      setStatus('pending');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="RegisterCoach">
      <View style={styles.screen}>
        <Header title="TORNAR-SE COACH" showBack onBack={() => router.back()} />
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          {status === 'pending' && (
            <View style={[styles.infoCard, styles.pendingCard]}>
              <Ionicons name="time-outline" size={24} color={COLORS.attention} />
              <Text style={styles.infoTitle}>Solicitação em Análise</Text>
              <Text style={styles.infoText}>Suas credenciais e CREF estão sendo analisados por nossa equipe administrativa. Você será notificado por e-mail assim que seu perfil for verificado.</Text>
            </View>
          )}

          {status === 'active' && (
            <View style={[styles.infoCard, styles.activeCard]}>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
              <Text style={styles.infoTitle}>Treinador Verificado</Text>
              <Text style={styles.infoText}>Parabéns! Seu perfil de Coach está ativo e verificado. Você já pode criar treinos públicos no aplicativo.</Text>
            </View>
          )}

          {status === 'suspended' && (
            <View style={[styles.infoCard, styles.suspendedCard]}>
              <Ionicons name="ban-outline" size={24} color={COLORS.error} />
              <Text style={styles.infoTitle}>Perfil Suspenso</Text>
              <Text style={styles.infoText}>Seu perfil de Coach foi suspenso temporariamente pela administração. Entre em contato com o suporte para maiores informações.</Text>
            </View>
          )}

          {!status && (
            <View>
              <Text style={styles.label}>NOME PROFISSIONAL *</Text>
              <TextInput style={styles.input} placeholder="Ex: Prof. Carlos Silva" placeholderTextColor={COLORS.textMuted} value={displayName} onChangeText={setDisplayName} />

              <Text style={styles.label}>CREF *</Text>
              <TextInput style={styles.input} placeholder="Ex: 123456-G/SP" placeholderTextColor={COLORS.textMuted} value={cref} onChangeText={setCref} />

              <Text style={styles.label}>URL DO COMPROVANTE (CREF/RG) *</Text>
              <TextInput style={styles.input} placeholder="Cole o link do seu comprovante digitalizado" placeholderTextColor={COLORS.textMuted} value={documentUrl} onChangeText={setDocumentUrl} />

              <Text style={styles.label}>ESPECIALIDADE / CATEGORIA</Text>
              <View style={styles.categoryRow}>
                {['fitness', 'crossfit', 'yoga', 'musculacao'].map((cat) => (
                  <TouchableOpacity key={cat} style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]} onPress={() => setCategory(cat)}>
                    <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>{cat.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>BIOGRAFIA / RESUMO PROFISSIONAL</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva sua experiência profissional..." placeholderTextColor={COLORS.textMuted} value={bio} onChangeText={setBio} multiline numberOfLines={4} />

              <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color={COLORS.background} /> : <Text style={styles.submitBtnText}>ENVIAR CREDENCIAIS</Text>}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.massive },
  label: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.lg, marginBottom: SPACING.xs, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, color: COLORS.textTitle, padding: SPACING.md, fontFamily: 'Inter_400Regular', fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginVertical: SPACING.xs },
  categoryBtn: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, borderStroke: 1, borderColor: COLORS.border } as any,
  categoryBtnActive: { backgroundColor: COLORS.primary },
  categoryBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted },
  categoryBtnTextActive: { color: COLORS.background },
  submitBtn: { backgroundColor: COLORS.primary, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginTop: SPACING.xl, ...SHADOWS.sm },
  submitBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  infoCard: { padding: SPACING.xl, borderRadius: BORDER_RADIUS.lg, borderLeftWidth: 4, marginBottom: SPACING.lg },
  pendingCard: { backgroundColor: COLORS.attention + '12', borderColor: COLORS.attention },
  activeCard: { backgroundColor: COLORS.success + '12', borderColor: COLORS.success },
  suspendedCard: { backgroundColor: COLORS.error + '12', borderColor: COLORS.error },
  infoTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginVertical: SPACING.xs },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 }
});
