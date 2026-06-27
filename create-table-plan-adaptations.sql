-- create-table-plan-adaptations.sql
-- Tabela de histórico de adaptações de planos - NOVAIX FITNESS

CREATE TABLE IF NOT EXISTS plan_adaptations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_plan JSONB,
  new_plan JSONB,
  reason TEXT,
  adapted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE plan_adaptations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own adaptations" ON plan_adaptations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adaptations" ON plan_adaptations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_plan_adaptations_user ON plan_adaptations(user_id, adapted_at DESC);
