import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { getMessages, sendMessage, subscribeToConversation } from '../../services/chat';
import { useAuth } from '../../context/AuthContext';
import type { ChatMessage } from '../../types';

interface DirectChatDrawerProps {
  visible: boolean;
  onClose: () => void;
  conversationId?: string;
  userName?: string;
  userAvatar?: string | null;
}

export default function DirectChatDrawer({ visible, onClose, conversationId, userName = 'Atleta', userAvatar = null }: DirectChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const convIdRef = useRef(conversationId);
  convIdRef.current = conversationId;

  useEffect(() => {
    if (!visible || !conversationId) return;
    setLoading(true);
    getMessages(conversationId).then(data => {
      setMessages(data);
      setLoading(false);
    });
  }, [visible, conversationId]);

  useEffect(() => {
    if (!visible || !conversationId) return;
    const unsub = subscribeToConversation(conversationId, {
      onNewMessage: (payload) => {
        const msg = payload.new as ChatMessage;
        if (msg.user_id !== user?.id) {
          setMessages(prev => [...prev, msg]);
        }
      },
      onMessageUpdate: (payload) => {
        const updated = payload.new as ChatMessage;
        setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
      },
      onPresenceSync: () => {},
      onPresenceJoin: () => {},
      onPresenceLeave: () => {},
    });
    return unsub;
  }, [visible, conversationId, user?.id]);

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [visible, messages]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !conversationId || !user?.id) return;
    const text = inputText.trim();
    setInputText('');

    const sent = await sendMessage(conversationId, user.id, text);
    if (sent) {
      setMessages(prev => [...prev, sent]);
    }
  }, [inputText, conversationId, user?.id]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.drawerContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <Avatar name={userName} uri={userAvatar ?? undefined} size="sm" />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userName}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textTitle} />
            </TouchableOpacity>
          </View>

          {/* Messages list */}
          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isMe = item.user_id === user?.id;
                const profile = item.profiles;
                return (
                  <View style={[styles.messageWrapper, isMe ? styles.messageSent : styles.messageReceived]}>
                    {!isMe && <Avatar name={profile?.name || userName} uri={profile?.avatar_url || userAvatar} size="xs" style={{ marginRight: 6 }} />}
                    <View style={[styles.bubble, isMe ? styles.bubbleSent : styles.bubbleReceived]}>
                      <Text style={[styles.messageText, isMe ? styles.textSent : styles.textReceived]}>
                        {item.deleted ? 'Mensagem apagada' : item.content}
                      </Text>
                      <Text style={styles.messageTime}>
                        {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          )}

          {/* Input field */}
          <SafeAreaView style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={COLORS.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!inputText.trim()}>
              <Ionicons name="send" size={18} color={inputText.trim() ? COLORS.primary : COLORS.textMuted} />
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  drawerContainer: { height: '70%', backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, borderWidth: 1, borderColor: 'rgba(204, 255, 0, 0.15)', borderBottomWidth: 0, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: 'rgba(30,35,42,0.9)' },
  userInfo: { flex: 1, marginLeft: SPACING.md },
  userName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  statusText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  closeBtn: { padding: 4 },
  messagesList: { padding: SPACING.lg, gap: SPACING.md },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4, maxWidth: '80%' },
  messageSent: { alignSelf: 'flex-end' },
  messageReceived: { alignSelf: 'flex-start' },
  bubble: { borderRadius: BORDER_RADIUS.lg, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  bubbleSent: { backgroundColor: COLORS.primary },
  bubbleReceived: { backgroundColor: COLORS.surfaceElevated, borderBottomLeftRadius: 2 },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  textSent: { color: COLORS.background },
  textReceived: { color: COLORS.textTitle },
  messageTime: { fontFamily: 'Inter_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 4, textAlign: 'right' },
  inputArea: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background },
  input: { flex: 1, height: 42, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.sm },
});
