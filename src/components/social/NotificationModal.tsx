// src/components/social/NotificationModal.js
import React, { useEffect } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useRealNotifications } from '../../hooks/useRealNotifications';

export default function NotificationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { notifications, loading, markAllRead, markRead, remove } = useRealNotifications();

  useEffect(() => {
    if (visible && notifications.some(n => !n.read)) markAllRead();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="notifications" size={20} color={COLORS.primary} />
              <Text style={styles.title}>NOTIFICAÇÕES</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} style={{ paddingVertical: SPACING.xl }} />
            ) : notifications.length === 0 ? (
              <Text style={styles.empty}>Nenhuma notificação ainda</Text>
            ) : (
              notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.item, !n.read && styles.itemUnread]}
                  onPress={() => { if (!n.read) markRead(n.id); }}
                  onLongPress={() => remove(n.id)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: n.color + '20' }]}>
                    <Ionicons name={n.icon as any} size={20} color={n.color} />
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.text}>{n.body || n.title}</Text>
                    <Text style={styles.time}>{n.timeAgo}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  container: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.lg, borderTopRightRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, borderBottomWidth: 0, padding: SPACING.xl, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 1 },
  scroll: { gap: SPACING.md, paddingBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  itemUnread: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primary + '08' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  content: { flex: 1 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center', paddingVertical: SPACING.xl },
});
