-- ============================================
-- TABELAS PARA WEARABLES
-- Heart rate, steps, sleep, calories
-- ============================================

-- Leituras de heart rate
CREATE TABLE IF NOT EXISTS heart_rate_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bpm INTEGER NOT NULL,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual','apple_watch','google_fit','chest_strap')),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_heart_rate_user ON heart_rate_readings(user_id, recorded_at DESC);

-- Passos diários
CREATE TABLE IF NOT EXISTS daily_steps (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  source TEXT DEFAULT 'manual',
  PRIMARY KEY (user_id, date)
);

-- Dados de sono
CREATE TABLE IF NOT EXISTS sleep_data (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  hours DECIMAL(4,2) DEFAULT 0,
  quality TEXT CHECK (quality IN ('poor','fair','good','excellent')),
  source TEXT DEFAULT 'manual',
  PRIMARY KEY (user_id, date)
);

-- RLS
ALTER TABLE heart_rate_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own heart rate" ON heart_rate_readings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own steps" ON daily_steps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sleep" ON sleep_data FOR ALL USING (auth.uid() = user_id);
