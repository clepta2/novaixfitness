-- ============================================
-- SISTEMA DE SEGURANÇA COMPLETO
-- Audit Trail + Moderação + Bloqueio + Rate Limit
-- ============================================

-- 1. AUDIT LOG - Registra TODA ação do usuário
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- 2. USER BLOCKS - Bloqueios temporários e permanentes
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_by UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  severity TEXT DEFAULT 'warning' CHECK (severity IN ('warning','temporary','permanent')),
  block_type TEXT NOT NULL CHECK (block_type IN (
    'post','comment','reaction','message','live','check_in',
    'story','group','referral','chat','all'
  )),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  appeal_status TEXT DEFAULT 'none' CHECK (appeal_status IN ('none','pending','approved','rejected')),
  appeal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocks_user ON user_blocks(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_blocks_expires ON user_blocks(expires_at) WHERE is_active = true;

-- 3. MODERATION RULES - Regras automáticas
CREATE TABLE IF NOT EXISTS moderation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_action TEXT NOT NULL,
  trigger_count INTEGER DEFAULT 3,
  time_window_minutes INTEGER DEFAULT 60,
  block_duration_hours INTEGER DEFAULT 24,
  block_type TEXT DEFAULT 'all',
  severity TEXT DEFAULT 'temporary',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTENT FLAGS - Conteúdo sinalizado
CREATE TABLE IF NOT EXISTS content_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id),
  target_user_id UUID REFERENCES profiles(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('post','comment','message','story','live_chat')),
  content_id UUID,
  reason TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN ('spam','inappropriate','harassment','hate','violence','scam','other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,
  auto_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flags_status ON content_flags(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flags_user ON content_flags(target_user_id);

-- 5. USER TRUST SCORE - Pontuação de confiança
CREATE TABLE IF NOT EXISTS user_trust (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  trust_score INTEGER DEFAULT 100,
  warnings_count INTEGER DEFAULT 0,
  blocks_count INTEGER DEFAULT 0,
  reports_received INTEGER DEFAULT 0,
  reports_filed INTEGER DEFAULT 0,
  last_violation_at TIMESTAMPTZ,
  auto_moderation_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RATE LIMITS POR USUÁRIO
CREATE TABLE IF NOT EXISTS user_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, action_type, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON user_rate_limits(user_id, action_type, window_start);

-- RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trust ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rate_limits ENABLE ROW LEVEL SECURITY;

-- Audit log: admin pode ler tudo, user só lee seus
CREATE POLICY "Admins can view all audit logs" ON audit_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "System can insert audit logs" ON audit_log FOR INSERT WITH CHECK (true);

-- User blocks
CREATE POLICY "Admins can manage blocks" ON user_blocks FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can view own blocks" ON user_blocks FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "System can insert blocks" ON user_blocks FOR INSERT WITH CHECK (true);

-- Moderation rules
CREATE POLICY "Admins can manage rules" ON moderation_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Content flags
CREATE POLICY "Admins can view all flags" ON content_flags FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert flags" ON content_flags FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- User trust
CREATE POLICY "Admins can manage trust" ON user_trust FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can view own trust" ON user_trust FOR SELECT
  USING (auth.uid() = user_id);

-- Rate limits
CREATE POLICY "System can manage rate limits" ON user_rate_limits FOR ALL
  USING (true);

-- ============================================
-- FUNÇÕES RPC DE SEGURANÇA
-- ============================================

-- Verificar se usuário está bloqueado para uma ação
CREATE OR REPLACE FUNCTION is_user_blocked(p_user_id UUID, p_block_type TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  block_record RECORD;
BEGIN
  FOR block_record IN
    SELECT * FROM user_blocks
    WHERE user_id = p_user_id
      AND is_active = true
      AND (block_type = 'all' OR block_type = p_block_type)
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY
      CASE severity WHEN 'permanent' THEN 1 WHEN 'temporary' THEN 2 WHEN 'warning' THEN 3 END,
      created_at DESC
    LIMIT 1
  LOOP
    result := json_build_object(
      'blocked', true,
      'reason', block_record.reason,
      'severity', block_record.severity,
      'block_type', block_record.block_type,
      'expires_at', block_record.expires_at,
      'blocked_at', block_record.created_at
    );
    RETURN result;
  END LOOP;

  RETURN json_build_object('blocked', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Registrar ação no audit log
CREATE OR REPLACE FUNCTION log_user_action(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address, p_user_agent)
  RETURNING id INTO log_id;

  -- Atualizar trust score baseado na ação
  PERFORM update_trust_score(p_user_id, p_action);

  -- Verificar se deve bloquear baseado em regras
  PERFORM check_moderation_rules(p_user_id, p_action);

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar pontuação de confiança
CREATE OR REPLACE FUNCTION update_trust_score(p_user_id UUID, p_action TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_trust (user_id, trust_score) VALUES (p_user_id, 100)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW();

  -- Ações positivas aumentam confiança
  IF p_action IN ('workout_completed', 'check_in', 'post_created', 'comment_made') THEN
    UPDATE user_trust SET trust_score = LEAST(trust_score + 1, 100) WHERE user_id = p_user_id;
  END IF;

  -- Ações negativas diminuem confiança
  IF p_action = 'content_flagged' THEN
    UPDATE user_trust SET trust_score = GREATEST(trust_score - 5, 0), warnings_count = warnings_count + 1 WHERE user_id = p_user_id;
  END IF;

  IF p_action = 'block_applied' THEN
    UPDATE user_trust SET trust_score = GREATEST(trust_score - 20, 0), blocks_count = blocks_count + 1 WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar regras de moderação automáticas
CREATE OR REPLACE FUNCTION check_moderation_rules(p_user_id UUID, p_action TEXT)
RETURNS VOID AS $$
DECLARE
  rule RECORD;
  action_count INTEGER;
BEGIN
  FOR rule IN
    SELECT * FROM moderation_rules
    WHERE trigger_action = p_action AND is_active = true
  LOOP
    SELECT COUNT(*) INTO action_count
    FROM audit_log
    WHERE user_id = p_user_id
      AND action = p_action
      AND created_at > NOW() - (rule.time_window_minutes || ' minutes')::INTERVAL;

    IF action_count >= rule.trigger_count THEN
      INSERT INTO user_blocks (user_id, reason, severity, block_type, expires_at)
      VALUES (
        p_user_id,
        'Bloqueio automático: ' || action_count || ' ações de ' || p_action || ' em ' || rule.time_window_minutes || ' minutos',
        rule.severity,
        rule.block_type,
        CASE WHEN rule.severity = 'permanent' THEN NULL
             ELSE NOW() + (rule.block_duration_hours || ' hours')::INTERVAL END
      );

      UPDATE user_trust SET trust_score = GREATEST(trust_score - 20, 0) WHERE user_id = p_user_id;

      INSERT INTO audit_log (user_id, action, entity_type, details)
      VALUES (p_user_id, 'auto_block', 'system', json_build_object('rule_id', rule.id, 'action_count', action_count));
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar rate limit por usuário
CREATE OR REPLACE FUNCTION check_user_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_count INTEGER DEFAULT 30,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS JSONB AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMPTZ;
BEGIN
  window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;

  SELECT COUNT(*) INTO current_count
  FROM audit_log
  WHERE user_id = p_user_id
    AND action = p_action_type
    AND created_at > window_start;

  IF current_count >= p_max_count THEN
    RETURN json_build_object(
      'allowed', false,
      'count', current_count,
      'limit', p_max_count,
      'retry_after_seconds', EXTRACT(EPOCH FROM (
        (SELECT MIN(created_at) + (p_window_minutes || ' minutes')::INTERVAL
         FROM audit_log WHERE user_id = p_user_id AND action = p_action_type)
        - NOW()
      ))::INTEGER
    );
  END IF;

  RETURN json_build_object('allowed', true, 'count', current_count, 'limit', p_max_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Buscar histórico completo de um usuário (admin)
CREATE OR REPLACE FUNCTION get_user_audit_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'logs', (
        SELECT json_agg(json_build_object(
          'id', al.id,
          'action', al.action,
          'entity_type', al.entity_type,
          'entity_id', al.entity_id,
          'details', al.details,
          'ip_address', al.ip_address,
          'created_at', al.created_at
        ))
        FROM (SELECT * FROM audit_log WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT p_limit OFFSET p_offset) al
      ),
      'total', (SELECT COUNT(*) FROM audit_log WHERE user_id = p_user_id),
      'trust', (SELECT row_to_json(ut) FROM user_trust ut WHERE user_id = p_user_id),
      'blocks', (
        SELECT json_agg(json_build_object(
          'id', ub.id,
          'reason', ub.reason,
          'severity', ub.severity,
          'block_type', ub.block_type,
          'expires_at', ub.expires_at,
          'is_active', ub.is_active,
          'created_at', ub.created_at
        ))
        FROM user_blocks ub WHERE user_id = p_user_id ORDER BY created_at DESC
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REGRAS PADRÃO DE MODERAÇÃO
-- ============================================

INSERT INTO moderation_rules (name, description, trigger_action, trigger_count, time_window_minutes, block_duration_hours, block_type, severity) VALUES
('Spam de Posts', 'Mais de 5 posts em 10 minutos', 'post_created', 5, 10, 24, 'post', 'temporary'),
('Spam de Comentários', 'Mais de 15 comentários em 10 minutos', 'comment_made', 15, 10, 12, 'comment', 'temporary'),
('Spam de Mensagens', 'Mais de 30 mensagens em 10 minutos', 'message_sent', 30, 10, 24, 'chat', 'temporary'),
('Spam de Reações', 'Mais de 50 reações em 10 minutos', 'reaction_made', 50, 10, 6, 'reaction', 'temporary'),
('Spam de Lives', 'Mais de 3 lives em 1 hora', 'live_created', 3, 60, 48, 'live', 'temporary'),
('Conteúdo Flagrado Múltiplas Vezes', '5 reports em 24 horas', 'content_flagged', 5, 1440, 168, 'all', 'temporary'),
('Tentativa de Acesso Não Autorizado', '3 tentativas em 5 minutos', 'unauthorized_access', 3, 5, 720, 'all', 'permanent'),
('Comportamento Reincidente', '3 bloqueios em 30 dias', 'block_applied', 3, 43200, NULL, 'all', 'permanent');
