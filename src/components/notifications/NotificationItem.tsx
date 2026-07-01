import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { APP_CONFIG } from '../../config/app';
import { typography } from '../../styles';

const NOTIFICATION_TYPES = APP_CONFIG.notifications.types;

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const diff = Date.now() - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
};

export default function NotificationItem({ item, onPress, onLongPress }) {
  const typeConfig = NOTIFICATION_TYPES[item.type] || NOTIFICATION_TYPES.system;

  return (
    <TouchableOpacity style={[styles.item, !item.read && styles.unread]} onPress={onPress} onLongPress={onLongPress} accessibilityLabel={`${item.title}. ${item.body}`} accessibilityRole="button" accessibilityHint={item.read ? 'Notificação lida' : 'Notificação não lida'}>
      <View style={[styles.icon, { backgroundColor: typeConfig.color + '20' }]}>
        <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{formatTime(item.created_at)}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  unread: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primary + '05' },
  icon: { width: 40, height: 40, borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  content: { flex: 1 },
  title: { ...typography.h5, marginBottom: 2 },
  titleUnread: { color: COLORS.primary },
  body: { ...typography.bodySmall, color: COLORS.textDescription, fontSize: 13, lineHeight: 18 },
  time: { ...typography.labelSmall, marginTop: SPACING.xs },
  dot: { width: 8, height: 8, borderRadius: SPACING.xs, backgroundColor: COLORS.primary, marginLeft: SPACING.sm, marginTop: SPACING.sm },
});
