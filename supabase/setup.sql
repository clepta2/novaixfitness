-- ============================================
-- NOVAIX FITNESS - SETUP COMPLETO
-- Rodar no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. RPC FUNCTIONS PARA SEGURANÇA
-- ============================================

-- Verificar se usuário está bloqueado
CREATE OR REPLACE FUNCTION is_user_blocked(p_user_id UUID, p_block_type TEXT)
RETURNS JSONB AS $$
DECLARE
  result RECORD;
BEGIN
  FOR result IN
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
    RETURN json_build_object(
      'blocked', true,
      'reason', result.reason,
      'severity', result.severity,
      'block_type', result.block_type,
      'expires_at', result.expires_at,
      'blocked_at', result.created_at
    );
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

  PERFORM update_trust_score(p_user_id, p_action);
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

  IF p_action IN ('workout_completed', 'check_in', 'post_created', 'comment_made') THEN
    UPDATE user_trust SET trust_score = LEAST(trust_score + 1, 100) WHERE user_id = p_user_id;
  END IF;

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

-- Buscar histórico de auditoria
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
-- 2. RPC FUNCTIONS PARA GAMIFICAÇÃO
-- ============================================

-- Incrementar/decrementar colunas genéricas
CREATE OR REPLACE FUNCTION increment_column(table_name text, column_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1', table_name, column_name, column_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_column(table_name text, column_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = GREATEST(%I - 1, 0) WHERE id = $1', table_name, column_name, column_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar likes do post
CREATE OR REPLACE FUNCTION increment_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrementar likes do post
CREATE OR REPLACE FUNCTION decrement_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar comentários do post
CREATE OR REPLACE FUNCTION increment_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Estatísticas do usuário
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_workouts', COALESCE((SELECT COUNT(*) FROM user_workouts WHERE user_id = p_user_id), 0),
    'current_streak', COALESCE((SELECT streak FROM profiles WHERE id = p_user_id), 0),
    'max_streak', COALESCE((SELECT max_streak FROM profiles WHERE id = p_user_id), 0),
    'total_minutes', COALESCE((SELECT SUM(duration_minutes) FROM user_workouts WHERE user_id = p_user_id), 0),
    'total_xp', COALESCE((SELECT xp FROM profiles WHERE id = p_user_id), 0),
    'level', COALESCE((SELECT level FROM profiles WHERE id = p_user_id), 1),
    'posts_count', COALESCE((SELECT COUNT(*) FROM posts WHERE user_id = p_user_id), 0),
    'comments_count', COALESCE((SELECT COUNT(*) FROM post_comments WHERE user_id = p_user_id), 0),
    'reactions_received', COALESCE((SELECT COUNT(*) FROM post_reactions pr JOIN posts p ON pr.post_id = p.id WHERE p.user_id = p_user_id), 0),
    'followers_count', COALESCE((SELECT COUNT(*) FROM user_follows WHERE following_id = p_user_id), 0),
    'check_ins_count', COALESCE((SELECT COUNT(*) FROM gym_check_ins WHERE user_id = p_user_id), 0),
    'referrals_count', COALESCE((SELECT successful_referrals FROM referrals WHERE referrer_id = p_user_id), 0)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. RPC FUNCTIONS PARA PAGAMENTOS
-- ============================================

-- Comprar coins
CREATE OR REPLACE FUNCTION buy_coins(p_user_id UUID, p_package_id UUID)
RETURNS JSONB AS $$
DECLARE
  pkg RECORD;
BEGIN
  SELECT * INTO pkg FROM coin_packages WHERE id = p_package_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Pacote não encontrado');
  END IF;

  INSERT INTO wallet (user_id, balance) VALUES (p_user_id, pkg.coins + pkg.bonus_coins)
  ON CONFLICT (user_id) DO UPDATE SET
    balance = wallet.balance + pkg.coins + pkg.bonus_coins,
    total_earned = wallet.total_earned + pkg.coins + pkg.bonus_coins,
    updated_at = NOW();

  RETURN json_build_object('success', true, 'coins_added', pkg.coins + pkg.bonus_coins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enviar presente
CREATE OR REPLACE FUNCTION send_gift(
  p_sender_id UUID,
  p_receiver_id UUID,
  p_gift_id UUID,
  p_live_id UUID DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  gift RECORD;
  sender_balance INTEGER;
BEGIN
  SELECT * INTO gift FROM gift_catalog WHERE id = p_gift_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN json_build_object('error', 'Presente não encontrado');
  END IF;

  SELECT balance INTO sender_balance FROM wallet WHERE user_id = p_sender_id;
  IF COALESCE(sender_balance, 0) < gift.coin_value THEN
    RETURN json_build_object('error', 'Saldo insuficiente');
  END IF;

  UPDATE wallet SET
    balance = balance - gift.coin_value,
    total_spent = total_spent + gift.coin_value,
    updated_at = NOW()
  WHERE user_id = p_sender_id;

  INSERT INTO wallet (user_id, balance, total_earned)
  VALUES (p_receiver_id, FLOOR(gift.coin_value * 0.7), FLOOR(gift.coin_value * 0.7))
  ON CONFLICT (user_id) DO UPDATE SET
    balance = wallet.balance + FLOOR(gift.coin_value * 0.7),
    total_earned = wallet.total_earned + FLOOR(gift.coin_value * 0.7),
    updated_at = NOW();

  INSERT INTO gift_transactions (sender_id, receiver_id, gift_id, live_id, coins_spent, message)
  VALUES (p_sender_id, p_receiver_id, p_gift_id, p_live_id, gift.coin_value, p_message);

  INSERT INTO gift_rankings (user_id, total_coins_sent, total_gifts_sent)
  VALUES (p_sender_id, gift.coin_value, 1)
  ON CONFLICT (user_id) DO UPDATE SET
    total_coins_sent = gift_rankings.total_coins_sent + gift.coin_value,
    total_gifts_sent = gift_rankings.total_gifts_sent + 1,
    updated_at = NOW();

  INSERT INTO gift_rankings (user_id, total_coins_received, total_gifts_received)
  VALUES (p_receiver_id, FLOOR(gift.coin_value * 0.7), 1)
  ON CONFLICT (user_id) DO UPDATE SET
    total_coins_received = gift_rankings.total_coins_received + FLOOR(gift.coin_value * 0.7),
    total_gifts_received = gift_rankings.total_gifts_received + 1,
    updated_at = NOW();

  RETURN json_build_object(
    'success', true,
    'gift_name', gift.name,
    'gift_emoji', gift.emoji,
    'coins_spent', gift.coin_value,
    'coins_earned', FLOOR(gift.coin_value * 0.7)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. TRIGGERS PARA CONTAGEM
-- ============================================

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

-- Trigger para criar profile no signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 5. REGRAS DE MODERAÇÃO PADRÃO
-- ============================================

INSERT INTO moderation_rules (name, description, trigger_action, trigger_count, time_window_minutes, block_duration_hours, block_type, severity) VALUES
('Spam de Posts', 'Mais de 5 posts em 10 minutos', 'post_created', 5, 10, 24, 'post', 'temporary'),
('Spam de Comentários', 'Mais de 15 comentários em 10 minutos', 'comment_made', 15, 10, 12, 'comment', 'temporary'),
('Spam de Mensagens', 'Mais de 30 mensagens em 10 minutos', 'message_sent', 30, 10, 24, 'chat', 'temporary'),
('Spam de Reações', 'Mais de 50 reações em 10 minutos', 'reaction_made', 50, 10, 6, 'reaction', 'temporary'),
('Spam de Lives', 'Mais de 3 lives em 1 hora', 'live_created', 3, 60, 48, 'live', 'temporary'),
('Conteúdo Flagrado Múltiplas Vezes', '5 reports em 24 horas', 'content_flagged', 5, 1440, 168, 'all', 'temporary'),
('Tentativa de Acesso Não Autorizado', '3 tentativas em 5 minutos', 'unauthorized_access', 3, 5, 720, 'all', 'permanent'),
('Comportamento Reincidente', '3 bloqueios em 30 dias', 'block_applied', 3, 43200, NULL, 'all', 'permanent')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. POLÍTICAS RLS PARA AUDIT LOG IMUTÁVEL
-- ============================================

-- Garantir que audit_log só aceite INSERT (imutável)
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_log;
CREATE POLICY "System can insert audit logs" ON audit_log FOR INSERT WITH CHECK (true);

-- Admins podem ler, mas NINGUÉM pode deletar ou atualizar
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_log;
CREATE POLICY "Admins can view all audit logs" ON audit_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Bloquear UPDATE e DELETE no audit_log
REVOKE UPDATE ON audit_log FROM authenticated;
REVOKE DELETE ON audit_log FROM authenticated;

-- ============================================
-- 7. SETUP COMPLETO
-- ============================================

-- Criar buckets de storage (executar no painel do Supabase)
-- Bucket: stories (5MB, image/jpeg, public)
-- Bucket: posts (já existe)

-- Verificar se todas as tabelas existem
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar se todas as RPC functions existem
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ============================================
-- FIM DO SETUP
-- ============================================
