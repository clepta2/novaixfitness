// src/services/liveWorkouts.ts
// Serviço de lives de treino

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import type { LiveWorkout, LiveParticipant, LiveMessage, LiveWorkoutState, LiveStatus } from '../types';

type RealtimePayload = { new: Record<string, unknown> };

interface LiveCallbacks {
  onMessage: (payload: RealtimePayload) => void;
  onParticipant: (payload: RealtimePayload) => void;
  onState: (payload: RealtimePayload) => void;
  onLiveUpdate: (payload: RealtimePayload) => void;
}

interface CreateLiveParams {
  title: string;
  description?: string;
  workoutType?: string;
  isPublic?: boolean;
}

export async function createLive(hostId: string, { title, description, workoutType, isPublic }: CreateLiveParams): Promise<LiveWorkout> {
  const { data, error } = await supabase
    .from(TABLES.LIVE_WORKOUTS)
    .insert({
      host_id: hostId,
      title,
      description: description || null,
      workout_type: workoutType || 'general',
      is_public: isPublic !== false,
    })
    .select()
    .maybeSingle();

  if (error) throw error;

  await supabase.from(TABLES.LIVE_PARTICIPANTS).insert({
    live_id: data.id,
    user_id: hostId,
    role: 'host',
  });

  await supabase.from(TABLES.LIVE_WORKOUT_STATE).insert({
    live_id: data.id,
    timer_seconds: 0,
  });

  return data as LiveWorkout;
}

export async function startLive(liveId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLES.LIVE_WORKOUTS)
    .update({ status: 'live', started_at: new Date().toISOString() })
    .eq('id', liveId);

  if (error) throw error;
}

export async function endLive(liveId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLES.LIVE_WORKOUTS)
    .update({ status: 'ended', ended_at: new Date().toISOString() })
    .eq('id', liveId);

  if (error) throw error;
}

export async function joinLive(liveId: string, userId: string): Promise<LiveParticipant> {
  const { data: existing } = await supabase
    .from(TABLES.LIVE_PARTICIPANTS)
    .select('id')
    .eq('live_id', liveId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return existing as LiveParticipant;

  const { data, error } = await supabase
    .from(TABLES.LIVE_PARTICIPANTS)
    .insert({ live_id: liveId, user_id: userId, role: 'participant' })
    .select()
    .maybeSingle();

  if (error) throw error;

  await supabase.rpc('increment_column', {
    table_name: 'live_workouts',
    column_name: 'participant_count',
    row_id: liveId,
  });

  return data as LiveParticipant;
}

export async function leaveLive(liveId: string, userId: string): Promise<void> {
  await supabase
    .from(TABLES.LIVE_PARTICIPANTS)
    .update({ left_at: new Date().toISOString() })
    .eq('live_id', liveId)
    .eq('user_id', userId);

  await supabase.rpc('decrement_column', {
    table_name: 'live_workouts',
    column_name: 'participant_count',
    row_id: liveId,
  });
}

export async function getActiveLives(): Promise<LiveWorkout[]> {
  const { data } = await supabase
    .from(TABLES.LIVE_WORKOUTS)
    .select('*, profiles:host_id(name, avatar_url), live_participants(count)')
    .in('status', ['live', 'scheduled'])
    .order('created_at', { ascending: false });

  return (data || []) as LiveWorkout[];
}

export async function getLiveById(liveId: string): Promise<LiveWorkout | null> {
  const { data } = await supabase
    .from(TABLES.LIVE_WORKOUTS)
    .select('*, profiles:host_id(name, avatar_url)')
    .eq('id', liveId)
    .maybeSingle();

  return data as LiveWorkout | null;
}

export async function getLiveParticipants(liveId: string): Promise<LiveParticipant[]> {
  const { data } = await supabase
    .from(TABLES.LIVE_PARTICIPANTS)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('live_id', liveId)
    .is('left_at', null)
    .order('joined_at', { ascending: true });

  return (data || []) as LiveParticipant[];
}

export async function sendMessage(liveId: string, userId: string, message: string, type: string = 'chat'): Promise<LiveMessage> {
  const { data, error } = await supabase
    .from(TABLES.LIVE_MESSAGES)
    .insert({ live_id: liveId, user_id: userId, message, type })
    .select('*, profiles:user_id(name, avatar_url)')
    .maybeSingle();

  if (error) throw error;
  return data as LiveMessage;
}

export async function getLiveMessages(liveId: string, limit: number = 50): Promise<LiveMessage[]> {
  const { data } = await supabase
    .from(TABLES.LIVE_MESSAGES)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('live_id', liveId)
    .order('created_at', { ascending: true })
    .limit(limit);

  return (data || []) as LiveMessage[];
}

export async function updateWorkoutState(liveId: string, state: Partial<LiveWorkoutState>): Promise<void> {
  const { error } = await supabase
    .from(TABLES.LIVE_WORKOUT_STATE)
    .update({ ...state, updated_at: new Date().toISOString() })
    .eq('live_id', liveId);

  if (error) throw error;
}

export async function getWorkoutState(liveId: string): Promise<LiveWorkoutState | null> {
  const { data } = await supabase
    .from(TABLES.LIVE_WORKOUT_STATE)
    .select('*')
    .eq('live_id', liveId)
    .maybeSingle();

  return data as LiveWorkoutState | null;
}

export function subscribeToLive(liveId: string, callbacks: LiveCallbacks): () => void {
  const channel = supabase
    .channel(`live-${liveId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.LIVE_MESSAGES, filter: `live_id=eq.${liveId}` }, callbacks.onMessage)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.LIVE_PARTICIPANTS, filter: `live_id=eq.${liveId}` }, callbacks.onParticipant)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: TABLES.LIVE_WORKOUT_STATE, filter: `live_id=eq.${liveId}` }, callbacks.onState)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: TABLES.LIVE_WORKOUTS, filter: `id=eq.${liveId}` }, callbacks.onLiveUpdate)
    .subscribe();

  return () => supabase.removeChannel(channel);
}
