-- Tabela de interações para algoritmo do feed
CREATE TABLE IF NOT EXISTS user_interactions (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  interaction_type TEXT CHECK (interaction_type IN ('view','like','comment','share','save','reaction')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interactions_post ON user_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user ON user_interactions(user_id);

-- RLS
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own interactions" ON user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view interactions" ON user_interactions FOR SELECT USING (true);
