-- Tabela de reações para posts
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heart','muscle','fire','clap','love','mindblown')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Trigger para atualizar reactions_count
CREATE OR REPLACE FUNCTION update_reactions_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET reactions_count = reactions_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET reactions_count = reactions_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_post_reaction_change ON post_reactions;
CREATE TRIGGER on_post_reaction_change
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION update_reactions_count();

-- RLS policies
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON post_reactions FOR DELETE USING (auth.uid() = user_id);
