-- Tabela de lives de treino
CREATE TABLE IF NOT EXISTS live_workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  workout_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','paused','ended')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER DEFAULT 50,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes da live
CREATE TABLE IF NOT EXISTS live_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  live_id UUID REFERENCES live_workouts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant' CHECK (role IN ('host','co-host','participant')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(live_id, user_id)
);

-- Chat da live (mensagens em tempo real)
CREATE TABLE IF NOT EXISTS live_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  live_id UUID REFERENCES live_workouts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'chat' CHECK (type IN ('chat','system','reaction','workout_update')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estado compartilhado do treino (timer, exercício atual)
CREATE TABLE IF NOT EXISTS live_workout_state (
  live_id UUID REFERENCES live_workouts(id) ON DELETE CASCADE PRIMARY KEY,
  current_exercise TEXT,
  exercise_index INTEGER DEFAULT 0,
  set_number INTEGER DEFAULT 0,
  rep_count INTEGER DEFAULT 0,
  timer_seconds INTEGER DEFAULT 0,
  is_resting BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_live_messages_live ON live_messages(live_id, created_at);
CREATE INDEX IF NOT EXISTS idx_live_participants_live ON live_participants(live_id);
CREATE INDEX IF NOT EXISTS idx_live_workouts_status ON live_workouts(status);

-- RLS
ALTER TABLE live_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_workout_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public lives" ON live_workouts FOR SELECT USING (is_public = true OR host_id = auth.uid());
CREATE POLICY "Hosts can create lives" ON live_workouts FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update own lives" ON live_workouts FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Participants visible to live members" ON live_participants FOR SELECT USING (true);
CREATE POLICY "Users can join lives" ON live_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave lives" ON live_participants FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Messages visible to live members" ON live_messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON live_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "State visible to live members" ON live_workout_state FOR SELECT USING (true);
CREATE POLICY "Host can update state" ON live_workout_state FOR ALL USING (
  EXISTS (SELECT 1 FROM live_workouts WHERE id = live_id AND host_id = auth.uid())
);
