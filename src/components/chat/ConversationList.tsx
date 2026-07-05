// src/components/chat/ConversationList.tsx
// Lista de conversas do chat

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { getUserConversations } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';

interface ConversationListProps {
  onSelectConversation: (conversation: any) => void;
  onNewChat: () => void;
}

export default function ConversationList({ onSelectConversation, onNewChat }: ConversationListProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadConversations(); }, [user?.id]);

  const loadConversations = async () => {
    if (!user?.id) return;
    const data = await getUserConversations(user.id);
    setConversations(data);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const getConversationTitle = (conv) => {
    if (conv.type === 'group') return conv.name;
    const other = conv.members?.find(m => m.user_id !== user.id);
    return other?.profiles?.name || 'Chat';
  };

  const getConversationAvatar = (conv) => {
    if (conv.type === 'group') return null;
    const other = conv.members?.find(m => m.user_id !== user.id);
    return other?.profiles?.avatar_url;
  };

  const getOtherUserId = (conv) => {
    if (conv.type === 'group') return null;
    const other = conv.members?.find(m => m.user_id !== user.id);
    return other?.user_id;
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onSelectConversation?.({ ...item, otherUserId: getOtherUserId(item) })}
    >
      <Avatar name={getConversationTitle(item)} uri={getConversationAvatar(item)} size="md" />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{getConversationTitle(item)}</Text>
          <Text style={styles.time}>{formatTime(item.lastMessage?.created_at)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content || 'Nenhuma mensagem'}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MENSAGENS</Text>
        <TouchableOpacity onPress={onNewChat}>
          <Ionicons name="create-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={conversations.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
            <Text style={styles.emptyDesc}>Inicie uma conversa com seus amigos</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, flex: 1 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessage: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, flex: 1 },
  badge: { backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6, marginLeft: SPACING.sm },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },
  emptyContainer: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, paddingBottom: SPACING.massive },
  emptyTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  emptyDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
});
