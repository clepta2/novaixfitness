-- ============================================
-- RPC Functions para NOVAIX FITNESS
-- Rodar no SQL Editor do Supabase
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

-- Decrementar comentários do post
CREATE OR REPLACE FUNCTION decrement_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar profile automaticamente no signup
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

-- Trigger para criar profile no signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Estatísticas do usuário para gamificação
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

-- Verificar rate limit de login
CREATE OR REPLACE FUNCTION check_login_rate_limit(client_email text)
RETURNS void AS $$
DECLARE
  attempt_count integer;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM login_attempts
  WHERE email = client_email
    AND created_at > NOW() - INTERVAL '15 minutes'
    AND is_successful = false;

  IF attempt_count >= 5 THEN
    RAISE EXCEPTION 'Muitas tentativas de login. Tente novamente mais tarde.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se IP está bloqueado
CREATE OR REPLACE FUNCTION is_ip_blocked()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_ips
    WHERE ip = current_setting('request.headers')::json->>'x-forwarded-for'
      AND blocked_until > NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
