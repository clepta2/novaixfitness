// src/components/chat/ChatView.tsx
// Tela de chat individual ou grupo

import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../hooks/useSecurity';
import { moderateText } from '../../services/contentModeration';
import { getMessages, sendMessage, markAsRead, subscribeToConversation } from '../../services/chat';
import { useI18n } from '../../i18n';

interface ChatViewProps {
  conversation: { id: string; name?: string; avatar_url?: string; [key: string]: any };
  onBack: () => void;
}

export default function ChatView({ conversation, onBack }: ChatViewProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const flatListRef = useRef(null);
  const { checkAndPerform, log, ACTIONS } = useSecurity();

  useEffect(() => {
    loadMessages();
    const unsub = subscribeToConversation(conversation.id, {
      onNewMessage: (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
          markAsRead(conversation.id, user.id);
        }
      },
      onMessageUpdate: (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
      },
      onPresenceSync: () => {},
      onPresenceJoin: () => {},
      onPresenceLeave: () => {},
    });

    markAsRead(conversation.id, user.id);
    return () => unsub();
  }, [conversation.id]);

  const loadMessages = async () => {
    const data = await getMessages(conversation.id);
    setMessages(data);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Moderar texto antes de enviar
    const textCheck = moderateText(newMessage, user.id);
    if (textCheck.blocked) {
      Alert.alert(t('chat.messageBlocked'), textCheck.message);
      return;
    }

    await checkAndPerform(ACTIONS.MESSAGE_SENT, 'chat', async () => {
      const msg = await sendMessage(conversation.id, user.id, newMessage.trim());
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    }, t('chat.sendMessageError'));
  };

  const getOtherName = () => {
    const other = conversation.members?.find(m => m.user_id !== user.id);
    return other?.profiles?.name || conversation.name || 'Chat';
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => {
    const isOwn = item.user_id === user.id;
    const showAvatar = index === 0 || messages[index - 1]?.user_id !== item.user_id;

    if (item.type === 'system') {
      return (
        <View style={styles.systemMessage}>
          <Text style={styles.systemText}>{item.content}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
        {!isOwn && showAvatar ? (
          <Avatar name={item.profiles?.name} size="xs" />
        ) : !isOwn ? (
          <View style={{ width: 24 }} />
        ) : null}
        <View style={[styles.bubble, isOwn && styles.bubbleOwn]}>
          {conversation.type === 'group' && !isOwn && showAvatar && (
            <Text style={styles.author}>{item.profiles?.name}</Text>
          )}
          <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>{item.content}</Text>
          <Text style={[styles.messageTime, isOwn && styles.messageTimeOwn]}>
            {formatTime(item.created_at)}
            {item.edited ? ' (editada)' : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Avatar name={getOtherName()} size="sm" />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{getOtherName()}</Text>
          {typingUsers.length > 0 && (
            <Text style={styles.typingText}>digitando...</Text>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Mensagem..."
          placeholderTextColor={COLORS.textMuted}
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!newMessage.trim()}>
          <Ionicons name="send" size={18} color={newMessage.trim() ? COLORS.primary : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.surface },
  headerInfo: { flex: 1 },
  headerName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  typingText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.primary },
  chatArea: { flex: 1 },
  chatContent: { padding: SPACING.lg, paddingBottom: SPACING.sm },
  messageRow: { flexDirection: 'row', marginBottom: SPACING.xs, maxWidth: '80%' },
  messageRowOwn: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubble: { backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, borderBottomLeftRadius: 4, padding: SPACING.sm, paddingHorizontal: SPACING.md, maxWidth: '100%' },
  bubbleOwn: { backgroundColor: COLORS.primary + '20', borderBottomLeftRadius: BORDER_RADIUS.lg, borderBottomRightRadius: 4 },
  author: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary, marginBottom: 2 },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
  messageTextOwn: { color: COLORS.textTitle },
  messageTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  messageTimeOwn: { color: COLORS.textMuted },
  systemMessage: { alignItems: 'center', marginVertical: SPACING.sm },
  systemText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.xl, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { padding: SPACING.sm },
});
