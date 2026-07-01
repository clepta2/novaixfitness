-- ============================================
-- MODERAÇÃO DE CONTEÚDO
-- Palavras personalizadas e análise de conteúdo
-- ============================================

-- Palavras bloqueadas personalizadas (admin pode adicionar)
CREATE TABLE IF NOT EXISTS moderation_custom_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'custom',
  added_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log de moderação detalhado
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  content_type TEXT NOT NULL,
  content_id UUID,
  content_preview TEXT,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('blocked','warning','flagged','approved')),
  flags JSONB DEFAULT '[]',
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_log_user ON moderation_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_log_action ON moderation_log(action_taken, created_at DESC);

-- Estatísticas de moderação por usuário
CREATE TABLE IF NOT EXISTS user_moderation_stats (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_flags INTEGER DEFAULT 0,
  total_blocks INTEGER DEFAULT 0,
  total_warnings INTEGER DEFAULT 0,
  last_flag_at TIMESTAMPTZ,
  last_block_at TIMESTAMPTZ,
  flag_categories JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE moderation_custom_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_moderation_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage custom words" ON moderation_custom_words FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can view moderation log" ON moderation_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "System can insert moderation log" ON moderation_log FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view moderation stats" ON user_moderation_stats FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- FUNÇÕES DE MODERAÇÃO
-- ============================================

-- Verificar texto contra palavras bloqueadas
CREATE OR REPLACE FUNCTION check_banned_words(input_text TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  flag RECORD;
  custom_word RECORD;
  flags JSONB := '[]';
  has_severe BOOLEAN := FALSE;
BEGIN
  -- Verificar palavras personalizadas do admin
  FOR custom_word IN
    SELECT word, category FROM moderation_custom_words WHERE is_active = true
  LOOP
    IF LOWER(input_text) LIKE '%' || LOWER(custom_word.word) || '%' THEN
      flags := flags || json_build_object(
        'type', 'custom_banned_word',
        'category', custom_word.category,
        'word', custom_word.word,
        'severity', 'severe'
      );
      has_severe := TRUE;
    END IF;
  END LOOP;

  RETURN json_build_object(
    'clean', json_array_length(flags) = 0,
    'flags', flags,
    'severity', CASE WHEN has_severe THEN 'severe' ELSE 'clean' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Registrar ação de moderação
CREATE OR REPLACE FUNCTION log_moderation_action(
  p_user_id UUID,
  p_content_type TEXT,
  p_content_id UUID,
  p_content_preview TEXT,
  p_action_taken TEXT,
  p_flags JSONB DEFAULT '[]'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO moderation_log (user_id, content_type, content_id, content_preview, action_taken, flags)
  VALUES (p_user_id, p_content_type, p_content_id, p_content_preview, p_action_taken, p_flags)
  RETURNING id INTO log_id;

  -- Atualizar estatísticas do usuário
  INSERT INTO user_moderation_stats (user_id, updated_at)
  VALUES (p_user_id, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_flags = CASE WHEN p_action_taken = 'flagged' THEN total_flags + 1 ELSE total_flags END,
    total_blocks = CASE WHEN p_action_taken = 'blocked' THEN total_blocks + 1 ELSE total_blocks END,
    total_warnings = CASE WHEN p_action_taken = 'warning' THEN total_warnings + 1 ELSE total_warnings END,
    last_flag_at = CASE WHEN p_action_taken IN ('flagged','blocked') THEN NOW() ELSE last_flag_at END,
    last_block_at = CASE WHEN p_action_taken = 'blocked' THEN NOW() ELSE last_block_at END,
    flag_categories = CASE
      WHEN p_action_taken = 'flagged' THEN
        jsonb_set(
          COALESCE(flag_categories, '{}'),
          ARRAY[(p_flags->0->>'category')::text],
          to_jsonb(COALESCE((flag_categories->>(p_flags->0->>'category'))::int, 0) + 1)
        )
      ELSE flag_categories
    END,
    updated_at = NOW();

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
