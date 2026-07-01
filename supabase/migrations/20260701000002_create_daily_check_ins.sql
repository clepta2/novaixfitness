-- Tabela de check-in diário
CREATE TABLE IF NOT EXISTS daily_check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  check_in_date DATE DEFAULT CURRENT_DATE,
  xp_awarded INTEGER DEFAULT 0,
  streak_day INTEGER DEFAULT 1,
  UNIQUE(user_id, check_in_date)
);

-- RLS policies
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins" ON daily_check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own check-ins" ON daily_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
