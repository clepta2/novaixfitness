-- Tabela de likes em comentários
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Tabela de replies a comentários
CREATE TABLE IF NOT EXISTS comment_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES comment_replies(id) ON DELETE CASCADE,
  reply_to_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mutes de usuários
CREATE TABLE IF NOT EXISTS user_mutes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  muted_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, muted_user_id)
);

-- Tabela de destaques de stories
CREATE TABLE IF NOT EXISTS story_highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de stories nos destaques (pivot)
CREATE TABLE IF NOT EXISTS story_highlight_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  highlight_id UUID REFERENCES story_highlights(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  position INT NOT NULL DEFAULT 0,
  UNIQUE(highlight_id, story_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_replies_comment ON comment_replies(comment_id);
CREATE INDEX IF NOT EXISTS idx_user_mutes_user ON user_mutes(user_id);
CREATE INDEX IF NOT EXISTS idx_story_highlights_user ON story_highlights(user_id);

-- RLS
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_highlight_items ENABLE ROW LEVEL SECURITY;

-- Policies: comment_likes
CREATE POLICY "Users can view comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Policies: comment_replies
CREATE POLICY "Users can view replies" ON comment_replies FOR SELECT USING (true);
CREATE POLICY "Users can insert own replies" ON comment_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON comment_replies FOR DELETE USING (auth.uid() = user_id);

-- Policies: user_mutes
CREATE POLICY "Users can view own mutes" ON user_mutes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mute others" ON user_mutes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unmute others" ON user_mutes FOR DELETE USING (auth.uid() = user_id);

-- Policies: story_highlights
CREATE POLICY "Users can view own highlights" ON story_highlights FOR SELECT USING (true);
CREATE POLICY "Users can manage own highlights" ON story_highlights FOR ALL USING (auth.uid() = user_id);

-- Policies: story_highlight_items
CREATE POLICY "Users can view highlight items" ON story_highlight_items FOR SELECT USING (true);
CREATE POLICY "Users can manage own highlight items" ON story_highlight_items FOR ALL
  USING (auth.uid() = (SELECT user_id FROM story_highlights WHERE id = highlight_id));
