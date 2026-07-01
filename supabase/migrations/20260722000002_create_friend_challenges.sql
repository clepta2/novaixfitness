-- ============================================
-- DESAFIOS ENTRE AMIGOS
-- Streak challenges, apostas, competições
-- ============================================

-- 1. Desafios entre amigos
CREATE TABLE IF NOT EXISTS friend_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN (
    'streak_30', 'workout_count', 'minutes', 'weight_loss', 'custom'
  )),
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  stake_coins INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','completed','cancelled')),
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Progresso dos desafios
CREATE TABLE IF NOT EXISTS challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES friend_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_value INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- 3. Histórico de competições
CREATE TABLE IF NOT EXISTS challenge_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES friend_challenges(id),
  winner_id UUID REFERENCES profiles(id),
  loser_id UUID REFERENCES profiles(id),
  stake_coins INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_challenges_users ON friend_challenges(challenger_id, challenged_id, status);
CREATE INDEX IF NOT EXISTS idx_challenge_progress ON challenge_progress(challenge_id, user_id);

-- RLS
ALTER TABLE friend_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges" ON friend_challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "Users can create challenges" ON friend_challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can update own challenges" ON friend_challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "Participants can view progress" ON challenge_progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM friend_challenges WHERE id = challenge_id AND (challenger_id = auth.uid() OR challenged_id = auth.uid())));
CREATE POLICY "Users can update own progress" ON challenge_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view history" ON challenge_history FOR SELECT
  USING (auth.uid() = winner_id OR auth.uid() = loser_id);
