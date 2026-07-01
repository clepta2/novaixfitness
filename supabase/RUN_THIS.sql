-- ============================================
-- NOVAIX FITNESS - RODAR ESTE SCRIPT COMPLETO
-- Copiar TUDO e colar no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. POST REACTIONS (já existe migration mas precisa rodar)
-- ============================================

CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('heart','muscle','fire','clap','love','mindblown')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

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

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all reactions" ON post_reactions;
DROP POLICY IF EXISTS "Users can insert own reactions" ON post_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON post_reactions;
CREATE POLICY "Users can view all reactions" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON post_reactions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. WALLET (verificar se existe)
-- ============================================

CREATE TABLE IF NOT EXISTS wallet (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own wallet" ON wallet;
DROP POLICY IF EXISTS "System can manage wallets" ON wallet;
CREATE POLICY "Users can view own wallet" ON wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON wallet FOR ALL USING (true);

-- ============================================
-- 3. COIN TRANSACTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('earned','spent','purchased','refunded','bonus')),
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own transactions" ON coin_transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON coin_transactions;
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON coin_transactions FOR INSERT WITH CHECK (true);

-- ============================================
-- 4. COIN PACKAGES
-- ============================================

CREATE TABLE IF NOT EXISTS coin_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  coins INTEGER NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL,
  bonus_coins INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active packages" ON coin_packages FOR SELECT USING (is_active = true);

INSERT INTO coin_packages (name, coins, price_brl, bonus_coins, is_popular) VALUES
('Pacote Básico', 100, 4.90, 0, false),
('Pacote Popular', 500, 19.90, 50, true),
('Pacote Premium', 1000, 34.90, 150, false),
('Pacote Mega', 2500, 79.90, 500, false),
('Pacote Ultra', 5000, 149.90, 1500, false)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. REGIONAL RANKINGS
-- ============================================

CREATE TABLE IF NOT EXISTS regional_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  points INTEGER DEFAULT 0,
  period TEXT DEFAULT 'monthly',
  period_start DATE DEFAULT CURRENT_DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, region, city, neighborhood, period)
);

ALTER TABLE regional_rankings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view rankings" ON regional_rankings;
DROP POLICY IF EXISTS "System can manage rankings" ON regional_rankings;
CREATE POLICY "Anyone can view rankings" ON regional_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage rankings" ON regional_rankings FOR ALL USING (true);

-- ============================================
-- 6. STORE PRODUCTS
-- ============================================

CREATE TABLE IF NOT EXISTS store_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL,
  price_usd DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view active products" ON store_products;
CREATE POLICY "Anyone can view active products" ON store_products FOR SELECT USING (is_active = true);

-- ============================================
-- 7. STORE ORDERS
-- ============================================

CREATE TABLE IF NOT EXISTS store_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total_brl DECIMAL(10,2) NOT NULL,
  payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON store_orders;
DROP POLICY IF EXISTS "Users can create orders" ON store_orders;
CREATE POLICY "Users can view own orders" ON store_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON store_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 8. STORE CART
-- ============================================

CREATE TABLE IF NOT EXISTS store_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES store_products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE store_cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON store_cart;
CREATE POLICY "Users can manage own cart" ON store_cart FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 9. AI WORKOUT PLANS
-- ============================================

CREATE TABLE IF NOT EXISTS ai_workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_workout_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own plans" ON ai_workout_plans;
DROP POLICY IF EXISTS "System can manage plans" ON ai_workout_plans;
CREATE POLICY "Users can view own plans" ON ai_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage plans" ON ai_workout_plans FOR ALL USING (true);

-- ============================================
-- 10. FIRST TIME ACHIEVEMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS first_time_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  coins_earned INTEGER DEFAULT 0,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

ALTER TABLE first_time_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own achievements" ON first_time_achievements;
DROP POLICY IF EXISTS "System can insert achievements" ON first_time_achievements;
CREATE POLICY "Users can view own achievements" ON first_time_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON first_time_achievements FOR INSERT WITH CHECK (true);

-- ============================================
-- 11. WALLET RPC
-- ============================================

CREATE OR REPLACE FUNCTION buy_coins(p_user_id UUID, p_package_id UUID)
RETURNS JSONB AS $$
DECLARE pkg RECORD;
BEGIN
  SELECT * INTO pkg FROM coin_packages WHERE id = p_package_id AND is_active = true;
  IF NOT FOUND THEN RETURN json_build_object('error', 'Pacote não encontrado'); END IF;
  INSERT INTO wallet (user_id, balance) VALUES (p_user_id, pkg.coins + pkg.bonus_coins)
  ON CONFLICT (user_id) DO UPDATE SET balance = wallet.balance + pkg.coins + pkg.bonus_coins, total_earned = wallet.total_earned + pkg.coins + pkg.bonus_coins, updated_at = NOW();
  RETURN json_build_object('success', true, 'coins_added', pkg.coins + pkg.bonus_coins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. SECURITY RPCs (verificar se existem)
-- ============================================

CREATE OR REPLACE FUNCTION is_user_blocked(p_user_id UUID, p_block_type TEXT)
RETURNS JSONB AS $$
DECLARE result RECORD;
BEGIN
  FOR result IN SELECT * FROM user_blocks WHERE user_id = p_user_id AND is_active = true AND (block_type = 'all' OR block_type = p_block_type) AND (expires_at IS NULL OR expires_at > NOW()) ORDER BY created_at DESC LIMIT 1 LOOP
    RETURN json_build_object('blocked', true, 'reason', result.reason, 'severity', result.severity, 'expires_at', result.expires_at);
  END LOOP;
  RETURN json_build_object('blocked', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_user_action(p_user_id UUID, p_action TEXT, p_entity_type TEXT, p_entity_id UUID DEFAULT NULL, p_details JSONB DEFAULT '{}')
RETURNS UUID AS $$
DECLARE log_id UUID;
BEGIN
  INSERT INTO audit_log (user_id, action, entity_type, entity_id, details) VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details) RETURNING id INTO log_id;
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_user_rate_limit(p_user_id UUID, p_action_type TEXT, p_max_count INTEGER DEFAULT 30, p_window_minutes INTEGER DEFAULT 60)
RETURNS JSONB AS $$
DECLARE current_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO current_count FROM audit_log WHERE user_id = p_user_id AND action = p_action_type AND created_at > NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  IF current_count >= p_max_count THEN
    RETURN json_build_object('allowed', false, 'count', current_count, 'limit', p_max_count);
  END IF;
  RETURN json_build_object('allowed', true, 'count', current_count, 'limit', p_max_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_column(table_name text, column_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1', table_name, column_name, column_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_column(table_name text, column_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = GREATEST(%I - 1, 0) WHERE id = $1', table_name, column_name, column_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET comments_count = comments_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION buy_coins(p_user_id UUID, p_package_id UUID)
RETURNS JSONB AS $$
DECLARE pkg RECORD;
BEGIN
  SELECT * INTO pkg FROM coin_packages WHERE id = p_package_id AND is_active = true;
  IF NOT FOUND THEN RETURN json_build_object('error', 'Pacote não encontrado'); END IF;
  INSERT INTO wallet (user_id, balance) VALUES (p_user_id, pkg.coins + pkg.bonus_coins)
  ON CONFLICT (user_id) DO UPDATE SET balance = wallet.balance + pkg.coins + pkg.bonus_coins, total_earned = wallet.total_earned + pkg.coins + pkg.bonus_coins, updated_at = NOW();
  RETURN json_build_object('success', true, 'coins_added', pkg.coins + pkg.bonus_coins);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIM - Verificar se tudo rodou sem erro
-- ============================================
