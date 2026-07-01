-- Tabela de duelos de treino
CREATE TABLE IF NOT EXISTS duels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID REFERENCES profiles(id),
  challenged_id UUID REFERENCES profiles(id),
  workout_id UUID,
  challenger_completed BOOLEAN DEFAULT FALSE,
  challenged_completed BOOLEAN DEFAULT FALSE,
  winner_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','completed','expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own duels" ON duels FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "Users can create duels" ON duels FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can update own duels" ON duels FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
