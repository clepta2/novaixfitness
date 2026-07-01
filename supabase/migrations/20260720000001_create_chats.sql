-- Tabela de conversas (DM e grupos)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT DEFAULT 'direct' CHECK (type IN ('direct','group')),
  name TEXT,
  group_id UUID REFERENCES workout_groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes das conversas
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin','member')),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  notifications BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Mensagens
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text','image','workout_share','system')),
  reply_to UUID REFERENCES messages(id),
  edited BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_members_conv ON conversation_members(conversation_id);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view conversations" ON conversations FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = id AND user_id = auth.uid()));
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can view members" ON conversation_members FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = conversation_members.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can join conversations" ON conversation_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Members can view messages" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Members can send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()));
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);
