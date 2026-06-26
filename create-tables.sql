-- =============================================
-- NOVAIX FITNESS - Criação de Tabelas
-- Cole este SQL no Supabase > SQL Editor > Run
-- =============================================

-- Tabela de perfis (usuarios)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  onboarding JSONB DEFAULT '{}',
  physical_data JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT,
  streak INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de treinos disponiveis
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  name TEXT,
  description TEXT,
  category TEXT,
  level TEXT,
  duration INTEGER,
  duration_minutes INTEGER,
  video_url TEXT,
  video_id TEXT,
  thumbnail_url TEXT,
  equipment JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treinos do usuario
CREATE TABLE IF NOT EXISTS user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  duration INTEGER,
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favoritos
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);

-- Posts da comunidade
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Likes nos posts
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comentários nos posts
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals/Convites
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  referral_code TEXT UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  bonus_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cupons de desconto
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount NUMERIC NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent',
  valid_until TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uso de cupons
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_code TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pagamentos (Asaas)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asaas_payment_id TEXT UNIQUE,
  asaas_customer_id TEXT,
  plan_type TEXT,
  billing_type TEXT,
  amount NUMERIC,
  status TEXT DEFAULT 'PENDING',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assinaturas (Asaas)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asaas_subscription_id TEXT UNIQUE,
  asaas_customer_id TEXT,
  plan_type TEXT,
  status TEXT DEFAULT 'ACTIVE',
  value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- HABILITAR RLS
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Colunas Asaas no profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT;

-- Colunas de gamificação
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0;

-- Colunas de consentimento LGPD
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consent_marketing BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consent_analytics BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consent_third_party BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consent_updated_at TIMESTAMPTZ;

-- Coluna de push token
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Tabela de solicitações de exclusão
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver minhas solicitações" ON data_deletion_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar solicitação" ON data_deletion_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS para conquistas
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver minhas conquistas" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Desbloquear conquista" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index para conquistas
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- =============================================
-- POLITICAS DE SEGURANCA
-- =============================================

-- Profiles
CREATE POLICY "Ver proprio perfil" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Atualizar proprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Inserir proprio perfil" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Workouts (todos podem ver)
CREATE POLICY "Ver treinos" ON workouts FOR SELECT USING (true);

-- User Workouts
CREATE POLICY "Ver meus treinos" ON user_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir meus treinos" ON user_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meus treinos" ON user_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Deletar meus treinos" ON user_workouts FOR DELETE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Ver meus favoritos" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir favorito" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar favorito" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Posts
CREATE POLICY "Ver posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Inserir meus posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meus posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Deletar meus posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Post Likes
CREATE POLICY "Ver likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Inserir like" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar like" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post Comments
CREATE POLICY "Ver comentarios" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Inserir comentario" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar comentario" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Referrals
CREATE POLICY "Ver meus referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Inserir referral" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Atualizar referral" ON referrals FOR UPDATE USING (auth.uid() = referrer_id);

-- Coupons (todos podem ler para validar)
CREATE POLICY "Ver cupons ativos" ON coupons FOR SELECT USING (active = true);

-- Coupon Usage
CREATE POLICY "Ver meus usos" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Registrar uso" ON coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments
CREATE POLICY "Ver meus pagamentos" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir meus pagamentos" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meus pagamentos" ON payments FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions
CREATE POLICY "Ver minhas assinaturas" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir minha assinatura" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar minha assinatura" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Funcao para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger no signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Funcao para atualizar likes_count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Funcao para atualizar comments_count
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_id ON payments(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_id ON subscriptions(asaas_subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_asaas_customer ON profiles(asaas_customer_id);

-- =============================================
-- TABELA CHAT COACH IA
-- =============================================

CREATE TABLE IF NOT EXISTS coach_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_user BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coach_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver minhas mensagens" ON coach_chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enviar mensagem" ON coach_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar minhas mensagens" ON coach_chat_messages FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_coach_chat_user ON coach_chat_messages(user_id, created_at);

-- =============================================
-- TABELA A/B TESTING
-- =============================================

CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, test_id)
);

CREATE TABLE IF NOT EXISTS ab_test_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  event TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver minhas atribuicoes" ON ab_test_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar atribuicao" ON ab_test_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Ver meus eventos" ON ab_test_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Registrar evento" ON ab_test_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ab_test_user ON ab_test_assignments(user_id, test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events ON ab_test_events(test_id, variant, event);

-- =============================================
-- TABELA DE DEPOIMENTOS
-- =============================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  initials TEXT,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver depoimentos aprovados" ON testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Criar depoimento publico" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Ver meus depoimentos" ON testimonials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Deletar meus depoimentos" ON testimonials FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, featured, created_at DESC);

-- =============================================
-- TABELA DE PERGUNTAS FREQUENTES
-- =============================================

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'geral',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver FAQs ativos" ON faqs FOR SELECT USING (active = true);

CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(active, sort_order);
