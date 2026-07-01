-- Tabela de posts salvos/bookmarks
CREATE TABLE IF NOT EXISTS saved_posts (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- RLS
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved posts" ON saved_posts FOR ALL USING (auth.uid() = user_id);
