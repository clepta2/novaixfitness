// src/components/social/DuelInvite.js
// Desafio de treino entre amigos

import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { useI18n } from '../../i18n';

export default function DuelInvite({ visible, onClose, currentUserId, friends = [] }) {
  const { t } = useI18n();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleInvite = async () => {
    if (!selectedFriend) { Alert.alert(t('common.error'), t('social.selectFriendError')); return; }

    await supabase.from('duels').insert({
      challenger_id: currentUserId,
      challenged_id: selectedFriend.id,
      workout_id: null,
      status: 'pending',
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    });

    await supabase.from('notifications').insert({
      user_id: selectedFriend.id,
      type: 'duel_invite',
      title: t('social.duelNotificationTitle'),
      body: t('social.duelNotificationBody'),
      data: { challenger_id: currentUserId },
    });

    setSelectedFriend(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>DESAFIAR AMIGO</Text>
          <Text style={styles.subtitle}>Escolha um amigo para um duelo de treino</Text>

          {friends.map(friend => (
            <TouchableOpacity
              key={friend.id}
              style={[styles.friendBtn, selectedFriend?.id === friend.id && styles.friendActive]}
              onPress={() => setSelectedFriend(friend)}
            >
              <View style={styles.friendAvatar}>
                <Text style={styles.friendInitial}>{friend.name?.charAt(0)}</Text>
              </View>
              <Text style={styles.friendName}>{friend.name}</Text>
              {selectedFriend?.id === friend.id && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite}>
            <Ionicons name="flash" size={20} color={COLORS.background} />
            <Text style={styles.inviteText}>ENVIAR DESAFIO</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40, maxHeight: '80%' },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, marginBottom: SPACING.xl },
  friendBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  friendActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  friendAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center' },
  friendInitial: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.primary },
  friendName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.lg },
  inviteText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});
