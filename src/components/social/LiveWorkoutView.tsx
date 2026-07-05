// src/components/social/LiveWorkoutView.tsx
// Tela completa de live de treino com timer, chat e participantes

import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useI18n } from '../../i18n';
import { Avatar } from '../ui/Avatar';
import { styles } from './liveWorkoutViewStyles';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../hooks/useSecurity';
import { moderateText } from '../../services/contentModeration';
import { subscribeToLive, sendMessage, getLiveMessages, getLiveParticipants, updateWorkoutState, leaveLive } from '../../services/liveWorkouts';

interface LiveWorkoutViewProps {
  live: { id: string; title?: string; host_id?: string; status?: string; [key: string]: any };
  isHost: boolean;
  onEnd: () => void;
}

export default function LiveWorkoutView({ live, isHost, onEnd }: LiveWorkoutViewProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timer, setTimer] = useState(0);
  const [currentExercise, setCurrentExercise] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const { checkAndPerform, log, ACTIONS } = useSecurity();

  useEffect(() => {
    loadData();
    const unsub = subscribeToLive(live.id, {
      onMessage: (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new]);
        }
      },
      onParticipant: (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setParticipants(prev => [...prev, payload.new]);
        } else if (payload.eventType === 'DELETE') {
          setParticipants(prev => prev.filter(p => p.user_id !== payload.old.user_id));
        }
      },
      onState: (payload: any) => {
        if (payload.new) {
          setTimer(payload.new.timer_seconds || 0);
          setCurrentExercise(payload.new.current_exercise || '');
          setIsResting(payload.new.is_resting || false);
        }
      },
      onLiveUpdate: (payload) => {
        if (payload.new?.status === 'ended') onEnd?.();
      },
    });

    if (isHost) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          updateWorkoutState(live.id, { timer_seconds: newTime });
          return newTime;
        });
      }, 1000);
    }

    return () => {
      unsub();
      clearInterval(timerRef.current);
    };
  }, [live.id]);

  const loadData = async () => {
    const [msgs, parts] = await Promise.all([
      getLiveMessages(live.id),
      getLiveParticipants(live.id),
    ]);
    setMessages(msgs);
    setParticipants(parts);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Moderar texto antes de enviar
    const textCheck = moderateText(newMessage, user.id);
    if (textCheck.blocked) {
      Alert.alert(t('live.messageBlocked'), textCheck.message);
      return;
    }

    await checkAndPerform(ACTIONS.LIVE_MESSAGE, 'live', async () => {
      await sendMessage(live.id, user.id, newMessage.trim());
      setNewMessage('');
    }, t('live.errorSendMessage'));
  };

  const handleToggleRest = async () => {
    if (!isHost) return;
    const newResting = !isResting;
    setIsResting(newResting);
    await updateWorkoutState(live.id, { is_resting: newResting } as any);
  };

  const handleNextExercise = async (exercise) => {
    if (!isHost) return;
    setCurrentExercise(exercise);
    await updateWorkoutState(live.id, { current_exercise: exercise });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.user_id === user.id && styles.messageOwn]}>
      <Avatar name={item.profiles?.name} size="xs" />
      <View style={styles.messageContent}>
        <Text style={styles.messageAuthor}>{item.profiles?.name || t('live.defaultUser')}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>{isResting ? t('live.resting') : t('live.time')}</Text>
        <Text style={[styles.timer, isResting && styles.timerRest]}>{formatTime(timer)}</Text>
        {currentExercise ? (
          <Text style={styles.exercise}>{t('live.exercise')}: {currentExercise}</Text>
        ) : null}
        {isHost && (
          <View style={styles.hostControls}>
            <TouchableOpacity style={styles.controlBtn} onPress={handleToggleRest}>
              <Ionicons name={isResting ? 'play' : 'pause'} size={20} color={COLORS.background} />
              <Text style={styles.controlText}>{isResting ? t('live.resume') : t('live.resting')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.participantsBar}>
        <TouchableOpacity onPress={() => setShowParticipants(!showParticipants)}>
          <Ionicons name="people" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={styles.participantCount}>{participants.length} {t('live.viewers')}</Text>
        {isHost && (
          <TouchableOpacity style={styles.endBtn} onPress={onEnd}>
            <Ionicons name="stop-circle" size={18} color={COLORS.error} />
            <Text style={styles.endText}>{t('live.end')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showParticipants && (
        <ScrollView style={styles.participantsList} horizontal showsHorizontalScrollIndicator={false}>
          {participants.map(p => (
            <View key={p.id} style={styles.participantChip}>
              <Avatar name={p.profiles?.name} size="xs" />
              <Text style={styles.participantName} numberOfLines={1}>{p.profiles?.name}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.chatArea}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={t('live.messagePlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!newMessage.trim()}>
          <Ionicons name="send" size={18} color={newMessage.trim() ? COLORS.primary : COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


