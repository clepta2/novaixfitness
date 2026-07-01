// src/components/social/PostInsights.tsx
// Overlay de analytics do post (visivel apenas ao dono)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { getPostInsights, type PostInsight } from '../../services/postAnalytics';

interface PostInsightsProps {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

export default function PostInsights({ postId, visible, onClose }: PostInsightsProps) {
  const [insights, setInsights] = useState<PostInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    getPostInsights(postId)
      .then(setInsights)
      .finally(() => setLoading(false));
  }, [postId, visible]);

  if (!visible) return null;

  const stats = insights
    ? [
        { icon: 'eye', label: 'Visualizacoes', value: insights.views },
        { icon: 'heart', label: 'Curtidas', value: insights.likes },
        { icon: 'chatbubble', label: 'Comentarios', value: insights.comments },
        { icon: 'share', label: 'Compartilhamentos', value: insights.shares },
      ]
    : [];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="analytics" size={16} color={COLORS.primary} />
            <Text style={styles.title}>Insights do Post</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : insights ? (
            <>
              <View style={styles.grid}>
                {stats.map((s) => (
                  <View key={s.label} style={styles.statBox}>
                    <Ionicons name={s.icon as any} size={18} color={COLORS.primary} />
                    <Text style={styles.statValue}>{s.value}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.engagementRow}>
                <Text style={styles.engagementLabel}>Taxa de engajamento</Text>
                <Text style={styles.engagementValue}>{insights.engagementRate}%</Text>
              </View>
            </>
          ) : (
            <Text style={styles.loadingText}>Sem dados disponiveis</Text>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    flex: 1,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.textTitle,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  engagementLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textDescription,
  },
  engagementValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.primary,
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
