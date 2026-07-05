// src/components/admin/CoachVerificationPanel.js
// Painel de Verificação de Coaches (CREF / KYC) - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

export default function CoachVerificationPanel() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCoaches();
  }, []);

  const fetchPendingCoaches = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/coaches/admin/pending`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setPending(data.coaches || []);
      }
    } catch (err) {
      if (__DEV__) console.warn('Erro ao buscar solicitações de coach:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/coaches/admin/${action}/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro na requisição');

      Alert.alert('Sucesso', `Solicitação de Coach ${action === 'approve' ? 'aprovada' : 'rejeitada'} com sucesso!`);
      setPending(prev => prev.filter(c => c.user_id !== id));
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && pending.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SOLICITAÇÕES DE COACH PENDENTES ({pending.length})</Text>

      {pending.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="shield-checkmark-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhuma solicitação de verificação de CREF pendente</Text>
        </View>
      ) : (
        pending.map((coach) => (
          <View key={coach.user_id} style={styles.card}>
            <View style={styles.header}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{(coach.display_name || 'C').charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>{coach.display_name}</Text>
                <Text style={styles.cref}>CREF: {coach.cref}</Text>
              </View>
            </View>

            {coach.bio && <Text style={styles.bio}>{coach.bio}</Text>}
            <Text style={styles.category}>Especialidade: <Text style={styles.categoryValue}>{coach.category.toUpperCase()}</Text></Text>

            <TouchableOpacity style={styles.docBtn} onPress={() => Linking.openURL(coach.document_url)}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
              <Text style={styles.docBtnText}>Visualizar Comprovante</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleAction(coach.user_id, 'reject')}>
                <Text style={styles.rejectText}>REJEITAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleAction(coach.user_id, 'approve')}>
                <Text style={styles.approveText}>APROVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.md },
  center: { paddingVertical: SPACING.xl, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.lg, letterSpacing: 0.5 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.md, textAlign: 'center' },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  headerInfo: { flex: 1 },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle },
  cref: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  bio: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18, marginBottom: SPACING.md },
  category: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
  categoryValue: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.primary },
  docBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.border + '30', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.lg },
  docBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  actionRow: { flexDirection: 'row', gap: SPACING.md },
  actionBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  rejectBtn: { borderWidth: 1, borderColor: COLORS.error },
  approveBtn: { backgroundColor: COLORS.primary },
  rejectText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.error },
  approveText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background }
});
