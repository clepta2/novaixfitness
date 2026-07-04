
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { ChatHeader, MessageBubble, ChatInput, QuickTips, ErrorBoundary, BottomTabBar } from '../src/components';
import { layout } from '../src/styles';
import { useChatCoach } from '../src/hooks/useChatCoach';

export default function ChatCoachScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { messages, inputText, setInputText, loading, historyLoaded, flatListRef, handleSend, handleClearChat } = useChatCoach(user as any, router);

  if (!historyLoaded) {
    return (
      <View style={[layout.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ErrorBoundary screenName="ChatCoach">
    <KeyboardAvoidingView style={layout.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ChatHeader onBack={() => router.back()} onClear={handleClearChat} />

      <FlatList
        ref={flatListRef as any}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: 110 }]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {messages.length <= 1 && <QuickTips onSendTip={handleSend} />}

      <ChatInput value={inputText} onChange={setInputText} onSend={() => handleSend()} loading={loading} />
      <BottomTabBar activeTab="perfil" />
    </KeyboardAvoidingView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 10 },
});
