-- Tabelas de grupos de treino
CREATE TABLE IF NOT EXISTS workout_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  category TEXT,
  member_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES workout_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin','moderator','member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES workout_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE workout_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view groups" ON workout_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated can create groups" ON workout_groups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Members can view group members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Members can view group posts" ON group_posts FOR SELECT USING (true);
CREATE POLICY "Members can create posts" ON group_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
