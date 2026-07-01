-- ============================================
-- NOVAIX FITNESS - SETUP COMPLETO
-- Copiar e colar no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard → SQL Editor → New Query
-- ============================================

-- ============================================
-- PARTE 1: TABELAS DE NEGÓCIO
-- ============================================

-- Carteira de moedas internas
CREATE TABLE IF NOT EXISTS wallet (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extrato imutável de moedas
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

-- Pacotes de compra
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

-- Ranking regional
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

-- Prêmios de ranking
CREATE TABLE IF NOT EXISTS ranking_prizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  period TEXT NOT NULL,
  prize_type TEXT NOT NULL CHECK (prize_type IN ('free_month','discount','coins','badge')),
  prize_value TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','awarded','expired')),
  awarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos da loja
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

-- Pedidos
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total_brl DECIMAL(10,2) NOT NULL,
  payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE IF NOT EXISTS store_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES store_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES store_products(id),
  quantity INTEGER DEFAULT 1,
  price_brl DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carrinho
CREATE TABLE IF NOT EXISTS store_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES store_products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Planos de treino IA
CREATE TABLE IF NOT EXISTS ai_workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de chat IA
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conquistas de primeira vez
CREATE TABLE IF NOT EXISTS first_time_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  coins_earned INTEGER DEFAULT 0,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

-- Sessões ativas
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  device_info JSONB,
  ip_address TEXT,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- PARTE 2: RLS POLICIES
-- ============================================

ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE first_time_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON wallet FOR ALL USING (true);
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON coin_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view active packages" ON coin_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view rankings" ON regional_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage rankings" ON regional_rankings FOR ALL USING (true);
CREATE POLICY "Users can view own prizes" ON ranking_prizes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage prizes" ON ranking_prizes FOR ALL USING (true);
CREATE POLICY "Anyone can view active products" ON store_products FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own orders" ON store_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON store_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own items" ON store_order_items FOR SELECT USING (EXISTS (SELECT 1 FROM store_orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own cart" ON store_cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own plans" ON ai_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage plans" ON ai_workout_plans FOR ALL USING (true);
CREATE POLICY "Users can view own history" ON ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert history" ON ai_chat_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own achievements" ON first_time_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON first_time_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own sessions" ON active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON active_sessions FOR ALL USING (true);

-- ============================================
-- PARTE 3: RPC FUNCTIONS
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
-- PARTE 4: DADOS INICIAIS
-- ============================================

INSERT INTO coin_packages (name, coins, price_brl, bonus_coins, is_popular) VALUES
('Pacote Básico', 100, 4.90, 0, false),
('Pacote Popular', 500, 19.90, 50, true),
('Pacote Premium', 1000, 34.90, 150, false),
('Pacote Mega', 2500, 79.90, 500, false),
('Pacote Ultra', 5000, 149.90, 1500, false)
ON CONFLICT DO NOTHING;

-- ============================================
-- PARTE 5: ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_regional_rankings_region ON regional_rankings(region, city, points DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_user ON store_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_plans_user ON ai_workout_plans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user ON active_sessions(user_id, is_revoked);

-- ============================================
-- FIM - Copiar todo este script e colar no SQL Editor do Supabase
-- ============================================
