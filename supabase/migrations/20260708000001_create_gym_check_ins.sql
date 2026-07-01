-- Tabela de check-in na academia
CREATE TABLE IF NOT EXISTS gym_check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  gym_name TEXT,
  gym_location GEOGRAPHY(POINT, 4326),
  workout_duration INTEGER,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE gym_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all check-ins" ON gym_check_ins FOR SELECT USING (true);
CREATE POLICY "Users can insert own check-ins" ON gym_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own check-ins" ON gym_check_ins FOR UPDATE USING (auth.uid() = user_id);
