-- Tabela de stories efêmeros
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_views (
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (story_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_stories_active ON stories(expires_at) WHERE expires_at > NOW();

-- RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active stories" ON stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view story views" ON story_views FOR SELECT USING (true);
CREATE POLICY "Users can insert own views" ON story_views FOR INSERT WITH CHECK (auth.uid() = user_id);
