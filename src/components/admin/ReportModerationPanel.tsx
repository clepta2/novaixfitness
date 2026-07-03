// src/components/admin/ReportModerationPanel.tsx
// Painel de Moderação de Denúncias da Comunidade

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { blockUser } from '../../services/security';

export default function ReportModerationPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id, reason, details, status, created_at, post_id, reported_user_id,
          reporter:profiles!reporter_id(name),
          reported:profiles!reported_user_id(name),
          post:posts(content, user_id)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      if (__DEV__) console.warn('Erro ao buscar denúncias:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'dismissed' })
        .eq('id', reportId);

      if (error) throw error;
      Alert.alert('Sucesso', 'Denúncia ignorada.');
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleDeletePost = async (reportId, postId) => {
    if (!postId) return;
    Alert.alert('Excluir Post', 'Tem certeza que deseja deletar este post?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error: postError } = await supabase.from('posts').delete().eq('id', postId);
            if (postError) throw postError;

            await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);

            Alert.alert('Sucesso', 'Post excluído e denúncia resolvida.');
            setReports(prev => prev.filter(r => r.id !== reportId));
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        }
      }
    ]);
  };

  const handleBlockUser = async (reportId, reportedUserId) => {
    if (!reportedUserId) return;
    Alert.alert('Bloquear Usuário', 'Deseja bloquear este usuário permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Bloquear',
        style: 'destructive',
        onPress: async () => {
          try {
            await blockUser(reportedUserId, null, {
              reason: 'Violação repetida das diretrizes da comunidade',
              severity: 'permanent',
              blockType: 'full'
            });

            await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);

            Alert.alert('Sucesso', 'Usuário bloqueado e denúncia resolvida.');
            setReports(prev => prev.filter(r => r.id !== reportId));
          } catch (err) {
            Alert.alert('Erro', err.message);
          }
        }
      }
    ]);
  };

  if (loading && reports.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>DENÚNCIAS PENDENTES ({reports.length})</Text>

      {reports.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="shield-checkmark-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>Nenhuma denúncia comunitária pendente</Text>
        </View>
      ) : (
        reports.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.reportHeader}>
              <Text style={styles.reporterText}>
                <Text style={styles.bold}>{r.reporter?.name || 'Atleta'}</Text> denunciou <Text style={styles.bold}>{r.reported?.name || 'Autor'}</Text>
              </Text>
              <Text style={styles.reasonBadge}>{r.reason}</Text>
            </View>

            {r.details && <Text style={styles.details}>Detalhes: {r.details}</Text>}

            {r.post && (
              <View style={styles.postContentCard}>
                <Text style={styles.postTitle}>CONTEÚDO DENUNCIADO:</Text>
                <Text style={styles.postContent}>{r.post.content}</Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, styles.dismissBtn]} onPress={() => handleDismiss(r.id)}>
                <Ionicons name="close-circle-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.dismissText}>IGNORAR</Text>
              </TouchableOpacity>

              {r.post_id && (
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDeletePost(r.id, r.post_id)}>
                  <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                  <Text style={styles.deleteText}>EXCLUIR POST</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.actionBtn, styles.blockBtn]} onPress={() => handleBlockUser(r.id, r.reported_user_id)}>
                <Ionicons name="ban-outline" size={16} color={COLORS.error} />
                <Text style={styles.blockText}>BANIR AUTOR</Text>
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
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.md },
  reporterText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, flex: 1 },
  bold: { fontFamily: 'Montserrat_700Bold' },
  reasonBadge: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.attention, backgroundColor: COLORS.attention + '15', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4 },
  details: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginBottom: SPACING.md, fontStyle: 'italic' },
  postContentCard: { backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  postTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: COLORS.textMuted, marginBottom: 4, letterSpacing: 0.5 },
  postContent: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
  dismissBtn: { borderColor: COLORS.border, backgroundColor: 'transparent' },
  deleteBtn: { borderColor: COLORS.error + '50', backgroundColor: COLORS.error + '10' },
  blockBtn: { borderColor: COLORS.error, backgroundColor: COLORS.error + '20' },
  dismissText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.textMuted },
  deleteText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.error },
  blockText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.error }
});
