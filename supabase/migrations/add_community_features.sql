-- add_community_features.sql
-- Tabelas de analytics, views, mutes e coluna archived

-- 1. Tabela de visualizacoes de posts
CREATE TABLE IF NOT EXISTS post_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_created_at ON post_views(created_at);

-- RLS para post_views
ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views" ON post_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Post owners can view their post views" ON post_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_views.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- 2. Tabela de mutes de usuarios
CREATE TABLE IF NOT EXISTS user_mutes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  muter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  muted_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(muter_id, muted_id),
  CHECK (muter_id != muted_id)
);

CREATE INDEX idx_user_mutes_muter ON user_mutes(muter_id);
CREATE INDEX idx_user_mutes_muted ON user_mutes(muted_id);

-- RLS para user_mutes
ALTER TABLE user_mutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mutes" ON user_mutes
  FOR ALL USING (auth.uid() = muter_id);

-- 3. Coluna archived na tabela posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
CREATE INDEX idx_posts_archived ON posts(user_id, archived) WHERE archived = true;

-- 4. Coluna category na tabela posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Comunidade';

-- 5. Funcao para buscar posts trending (por engajamento)
CREATE OR REPLACE FUNCTION get_trending_posts(
  days_back INTEGER DEFAULT 7,
  result_limit INTEGER DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  likes_count INTEGER,
  engagement_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.content,
    p.image_url,
    p.created_at,
    p.likes_count,
    (COALESCE(p.likes_count, 0) + COALESCE(pc.cnt, 0))::NUMERIC AS engagement_score
  FROM posts p
  LEFT JOIN (
    SELECT post_id, COUNT(*) AS cnt
    FROM post_comments
    GROUP BY post_id
  ) pc ON pc.post_id = p.id
  WHERE p.archived = false
    AND p.created_at >= NOW() - (days_back || ' days')::INTERVAL
  ORDER BY engagement_score DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- 6. Funcao para incrementar views
CREATE OR REPLACE FUNCTION increment_post_views(
  p_post_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO post_views (post_id, user_id)
  VALUES (p_post_id, p_user_id);
END;
$$ LANGUAGE plpgsql;
