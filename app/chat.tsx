
// app/chat.tsx
// Pagina de chats com melhorias visuais - NOVAIX FITNESS

import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { Header, ErrorBoundary, ConversationList, ChatView, NewChatModal } from '../src/components';
import { getOrCreateDirectConversation } from '../src/services/chat';
import { useResponsive } from '../src/hooks/useResponsive';

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSmall } = useResponsive();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  // Animacao de entrada
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const handleSelectConversation = (conv: any) => {
    setSelectedConversation(conv);
  };

  const handleNewChat = async (selectedUser: any) => {
    const convId = await getOrCreateDirectConversation(user.id, selectedUser.id);
    setSelectedConversation({
      id: convId,
      type: 'direct',
      members: [
        { user_id: user.id, profiles: { name: user.user_metadata?.name || 'Voce' } },
        { user_id: selectedUser.id, profiles: { name: selectedUser.name, avatar_url: selectedUser.avatar_url } },
      ],
    });
  };

  if (selectedConversation) {
    return (
      <ErrorBoundary screenName="Chat">
        <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
          <ChatView conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
        </Animated.View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="ChatList">
      <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
        <Header title="MENSAGENS" showBack onBack={() => router.back()} />
        <ConversationList onSelectConversation={handleSelectConversation} onNewChat={() => setShowNewChat(true)} />
        <NewChatModal visible={showNewChat} onClose={() => setShowNewChat(false)} onSelectUser={handleNewChat} />
      </Animated.View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
});
