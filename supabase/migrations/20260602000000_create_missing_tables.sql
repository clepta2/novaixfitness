-- =============================================
-- NOVAIX FITNESS - Tabelas que faltam
-- Cole este SQL no Supabase > SQL Editor > Run
-- =============================================

-- 1. TABELA DE CRASH REPORTS
-- Armazena erros fatais reportados pelo app
CREATE TABLE IF NOT EXISTS crash_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  stack TEXT,
  name TEXT DEFAULT 'Error',
  platform TEXT,
  version TEXT,
  breadcrumbs TEXT,
  extra TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crash_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode ver crashes" ON crash_reports FOR SELECT USING (true);
CREATE POLICY "App pode reportar crash" ON crash_reports FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_crash_reports_user ON crash_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crash_reports_created ON crash_reports(created_at DESC);

-- 2. TABELA DE ERROS TRATADOS
-- Erros que nao sao fatais mas devem ser rastreados
CREATE TABLE IF NOT EXISTS handled_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  stack TEXT,
  context TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE handled_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode ver erros" ON handled_errors FOR SELECT USING (true);
CREATE POLICY "App pode reportar erro" ON handled_errors FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_handled_errors_user ON handled_errors(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_handled_errors_context ON handled_errors(context, created_at DESC);

-- 3. TABELA DE EVENTOS DE ANALYTICS
-- Rastreia eventos de uso do app
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  params TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode ver eventos" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "App pode registrar evento" ON analytics_events FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- 4. TABELA DE LOGS DE PESO
-- Registros de peso do usuario para graficos de evolucao
CREATE TABLE IF NOT EXISTS weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight NUMERIC NOT NULL,
  body_fat NUMERIC,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver meus pesos" ON weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar peso" ON weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar peso" ON weight_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user ON weight_logs(user_id, recorded_at DESC);

-- 5. TABELA DE LOGS DE REFEICOES
-- Registro de refeicoes do usuario (nutrition tracker)
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories NUMERIC DEFAULT 0,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  quantity TEXT,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver minhas refeicoes" ON meal_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar refeicao" ON meal_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar refeicao" ON meal_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meal_logs_user ON meal_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_logs_type ON meal_logs(user_id, meal_type, logged_at DESC);

-- 6. TABELA DE WAITLIST
-- Lista de espera para features premium
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_id)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver minha waitlist" ON waitlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Entrar na waitlist" ON waitlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_waitlist_user ON waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_feature ON waitlist(feature_id, created_at DESC);

-- =============================================
-- TABELA DE POSTS DO FORUM
-- =============================================

CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver posts do forum" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Criar post no forum" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meu post" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Deletar meu post" ON forum_posts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON forum_posts(user_id);

-- =============================================
-- RESPOSTAS DO FORUM
-- =============================================

CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver respostas" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Criar resposta" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar minha resposta" ON forum_replies FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id, created_at);

-- =============================================
-- TRIGGERS PARA FORUM
-- =============================================

-- Atualizar replies_count no forum_posts
CREATE OR REPLACE FUNCTION update_forum_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forum_posts SET replies_count = replies_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forum_posts SET replies_count = replies_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_forum_reply_change
  AFTER INSERT OR DELETE ON forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_forum_replies_count();

-- =============================================
-- TABELA DE PLANOS DE TREINO SEMANAIS
-- =============================================

CREATE TABLE IF NOT EXISTS user_week_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  workout_name TEXT,
  is_rest_day BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_of_week, is_active)
);

ALTER TABLE user_week_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver meu plano semanal" ON user_week_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar meu plano" ON user_week_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meu plano" ON user_week_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Deletar meu plano" ON user_week_plans FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_week_plans_user ON user_week_plans(user_id, is_active, day_of_week);
