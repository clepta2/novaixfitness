// src/types/live.ts - Tipos de treinos ao vivo

export type LiveStatus = 'scheduled' | 'live' | 'ended';

export type LiveWorkout = {
  id: string; host_id: string; title: string; description: string | null;
  workout_type: string; is_public: boolean; status: LiveStatus;
  participant_count: number; started_at: string | null; ended_at: string | null;
  created_at: string; profiles?: { name: string; avatar_url: string | null };
};

export type LiveParticipantRole = 'host' | 'participant';

export type LiveParticipant = {
  id: string; live_id: string; user_id: string; role: LiveParticipantRole;
  joined_at: string; left_at: string | null;
  profiles?: { name: string; avatar_url: string | null };
};

export type LiveMessage = {
  id: string; live_id: string; user_id: string; message: string;
  type: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};

export type LiveWorkoutState = {
  id: string; live_id: string; timer_seconds: number; current_exercise?: string; updated_at: string;
};
