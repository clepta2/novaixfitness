// src/components/common/ErrorCard.js
// Card de erro padronizado - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useFadeInUp } from '../../utils/animations';

const ERROR_TYPES = {
  network: { icon: 'wifi-off', title: 'Sem conexão', color: COLORS.attention },
  server: { icon: 'server-outline', title: 'Erro no servidor', color: COLORS.error },
  notFound: { icon: 'search-outline', title: 'Não encontrado', color: COLORS.textMuted },
  permission: { icon: 'lock-closed', title: 'Acesso negado', color: COLORS.error },
  generic: { icon: 'alert-circle', title: 'Algo deu errado', color: COLORS.error },
};

export default function ErrorCard({ type = 'generic', message, onRetry, onReport }) {
  const { opacity, translateY } = useFadeInUp();
  const config = ERROR_TYPES[type] || ERROR_TYPES.generic;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <View style={[styles.iconContainer, { backgroundColor: config.color + '15' }]}>
        <Ionicons name={config.icon} size={32} color={config.color} />
      </View>

      <Text style={styles.title}>{config.title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}

      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Ionicons name="refresh" size={18} color={COLORS.primary} />
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        )}
        {onReport && (
          <TouchableOpacity style={styles.reportBtn} onPress={onReport}>
            <Text style={styles.reportText}>Reportar Problema</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: SPACING.xxxl, paddingHorizontal: SPACING.xl },
  iconContainer: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, textAlign: 'center', marginBottom: SPACING.sm },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.xl },
  actions: { gap: SPACING.sm, width: '100%', maxWidth: 250 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md },
  retryText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
  reportBtn: { alignItems: 'center', paddingVertical: SPACING.sm },
  reportText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
});
