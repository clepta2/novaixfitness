-- ============================================
-- SISTEMA DE CRIADORES/INFLUENCIADORES
-- Perfil creator, conteúdo premium, revenue split
-- ============================================

-- 1. Perfis de creator
CREATE TABLE IF NOT EXISTS creator_profiles (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  category TEXT DEFAULT 'fitness',
  is_verified BOOLEAN DEFAULT false,
  subscriber_count INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(3,2) DEFAULT 0.70,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assinaturas de fãs
CREATE TABLE IF NOT EXISTS creator_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'monthly' CHECK (plan_type IN ('monthly','yearly')),
  price_brl DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','cancelled','expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, subscriber_id)
);

-- 3. Conteúdo exclusivo
CREATE TABLE IF NOT EXISTS creator_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creator_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'workout' CHECK (content_type IN ('workout','tip','routine','video','article')),
  media_url TEXT,
  is_premium BOOLEAN DEFAULT true,
  price_coins INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transações de revenue
CREATE TABLE IF NOT EXISTS creator_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES creator_profiles(user_id),
  subscription_id UUID REFERENCES creator_subscriptions(id),
  amount_brl DECIMAL(10,2) NOT NULL,
  commission DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_creator_subs ON creator_subscriptions(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_creator_content ON creator_content(creator_id, created_at DESC);

-- RLS
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view creators" ON creator_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own creator profile" ON creator_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON creator_subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can subscribe" ON creator_subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

CREATE POLICY "Anyone can view published content" ON creator_content FOR SELECT USING (true);
CREATE POLICY "Creators can manage own content" ON creator_content FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Creators can view own revenue" ON creator_revenue FOR SELECT USING (auth.uid() = creator_id);
