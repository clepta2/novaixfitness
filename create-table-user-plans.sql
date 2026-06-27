-- create-table-user-plans.sql
-- Tabela de planos de treino personalizados gerados pelo onboarding - NOVAIX FITNESS

CREATE TABLE IF NOT EXISTS user_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Treino',
  duration_minutes INTEGER DEFAULT 60,
  exercises JSONB DEFAULT '[]',
  day_of_week TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_of_week)
);

-- RLS policies
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans" ON user_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON user_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON user_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON user_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_user_plans_user_active ON user_plans(user_id, is_active);
