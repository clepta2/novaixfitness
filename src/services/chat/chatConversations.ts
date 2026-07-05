// src/services/chatConversations.ts
// Gerenciamento de conversas

import { supabase } from '../../config/supabase';
import { TABLES } from '../../config/tables';
import { createServiceGuard } from '../../utils/serviceGuard';
import { tryIf } from '../../utils/tryIf';
import type { Conversation, ChatMessage, ConversationMember } from '../../types';

const guard = createServiceGuard({ serviceName: 'chatConversations' });

type RealtimePayload = { new: Record<string, unknown> };

interface PresenceState {
  [key: string]: { user_id: string; online_at: string }[];
}

interface ConversationCallbacks {
  onNewMessage: (payload: RealtimePayload) => void;
  onMessageUpdate: (payload: RealtimePayload) => void;
  onPresenceSync: () => void;
  onPresenceJoin: (key: string, presence: PresenceState[string]) => void;
  onPresenceLeave: (key: string, presence: PresenceState[string]) => void;
}

export interface ConversationResult extends Conversation {
  members: ConversationMember[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

export async function getOrCreateDirectConversation(userId1: string, userId2: string): Promise<string> {
  const result = await tryIf(async () => {
    const { data: members1 } = await supabase
      .from(TABLES.CONVERSATION_MEMBERS)
      .select('conversation_id')
      .eq('user_id', userId1);

    const convIds = (members1 || []).map(m => m.conversation_id);
    if (convIds.length > 0) {
      const { data: existingMember } = await supabase
        .from(TABLES.CONVERSATION_MEMBERS)
        .select('conversation_id, conversations!inner(type)')
        .in('conversation_id', convIds)
        .eq('user_id', userId2)
        .eq('conversations.type', 'direct')
        .maybeSingle();

      if (existingMember) return existingMember.conversation_id;
    }

    const { data: conv, error } = await supabase.from(TABLES.CONVERSATIONS)
      .insert({ type: 'direct' }).select().single();
    if (error) throw error;

    await supabase.from(TABLES.CONVERSATION_MEMBERS).insert([
      { conversation_id: conv.id, user_id: userId1 },
      { conversation_id: conv.id, user_id: userId2 },
    ]);
    return conv.id;
  }, { retries: 2, baseDelay: 500 });
  if (result.ok) return result.data;
  throw result.error;
}

export async function createGroupConversation(name: string, userId: string, memberIds: string[]): Promise<string> {
  const result = await tryIf(async () => {
    const { data: conv, error } = await supabase.from(TABLES.CONVERSATIONS)
      .insert({ type: 'group', name }).select().single();
    if (error) throw error;

    const members = [
      { conversation_id: conv.id, user_id: userId, role: 'admin' },
      ...memberIds.map(id => ({ conversation_id: conv.id, user_id: id })),
    ];
    await supabase.from(TABLES.CONVERSATION_MEMBERS).insert(members);
    return conv.id;
  }, { retries: 3, baseDelay: 1000 });
  if (result.ok) return result.data;
  throw result.error;
}

export async function getUserConversations(userId: string): Promise<ConversationResult[]> {
  const result = await tryIf(async () => {
    const { data: memberships } = await supabase
      .from(TABLES.CONVERSATION_MEMBERS)
      .select('conversation_id, last_read_at')
      .eq('user_id', userId);

    if (!memberships?.length) return [];
    const convIds = memberships.map(m => m.conversation_id);

    const { data: conversations } = await supabase
      .from(TABLES.CONVERSATIONS)
      .select('*')
      .in('id', convIds)
      .order('updated_at', { ascending: false });

    const results = await Promise.all((conversations || []).map(async (conv) => {
      const { data: members } = await supabase
        .from(TABLES.CONVERSATION_MEMBERS)
        .select('conversation_id, user_id, profiles:user_id(name, avatar_url)')
        .eq('conversation_id', conv.id);

      const { data: lastMsg } = await supabase
        .from(TABLES.MESSAGES)
        .select('id, conversation_id, user_id, content, type, reply_to, edited, deleted, created_at, profiles:user_id(name, avatar_url)')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const membership = memberships.find(m => m.conversation_id === conv.id);
      const { count: unread } = await supabase
        .from(TABLES.MESSAGES)
        .select('id', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .gt('created_at', membership?.last_read_at || '1970-01-01')
        .neq('user_id', userId);

      const membersList = (members || []).map((m: any) => ({
        conversation_id: conv.id,
        user_id: m.user_id,
        profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles,
      })) as ConversationMember[];

      const mappedLastMsg = lastMsg ? {
        ...lastMsg,
        profiles: Array.isArray((lastMsg as any).profiles) ? (lastMsg as any).profiles[0] : (lastMsg as any).profiles,
      } as unknown as ChatMessage : null;

      return {
        ...conv,
        members: membersList,
        lastMessage: mappedLastMsg,
        unreadCount: unread || 0,
      };
    }));

    return results;
  }, { retries: 1, baseDelay: 500 });
  return result.ok ? (result.data as ConversationResult[]) : [];
}

export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  const result = await tryIf(async () => {
    await supabase.from(TABLES.CONVERSATION_MEMBERS)
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : undefined;
}

export function subscribeToConversation(conversationId: string, callbacks: ConversationCallbacks): () => void {
  const channel = supabase.channel(`chat-${conversationId}`);
  const anyChannel = channel as any;
  anyChannel
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLES.MESSAGES, filter: `conversation_id=eq.${conversationId}` }, callbacks.onNewMessage)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: TABLES.MESSAGES, filter: `conversation_id=eq.${conversationId}` }, callbacks.onMessageUpdate)
    .on('presence', { event: 'sync' }, callbacks.onPresenceSync)
    .on('presence', { event: 'join' }, callbacks.onPresenceJoin)
    .on('presence', { event: 'leave' }, callbacks.onPresenceLeave)
    .subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await anyChannel.track({ user_id: '', online_at: new Date().toISOString() });
      }
    });
  return () => supabase.removeChannel(channel);
}
