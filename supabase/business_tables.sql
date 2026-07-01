-- ============================================
-- NOVAIX FITNESS - TABELAS DE NEGÓCIO
-- Moeda Interna, Ranking Regional, Loja, IA
-- ============================================

-- ============================================
-- 1. MOEDA INTERNA (NOVAIX COINS)
-- ============================================

-- Carteira do usuário
CREATE TABLE IF NOT EXISTS wallet (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extrato imutável de moedas (ledger)
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

-- Pacotes de compra de coins
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

-- ============================================
-- 2. RANKING REGIONAL
-- ============================================

-- Ranking de usuários por região
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

-- ============================================
-- 3. LOJA (E-COMMERCE)
-- ============================================

-- Produtos físicos
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

-- Carrinho de compras
CREATE TABLE IF NOT EXISTS store_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES store_products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- 4. IA / TREINOS
-- ============================================

-- Planos de treino gerados por IA
CREATE TABLE IF NOT EXISTS ai_workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de perguntas à IA
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CONQUISTAS E ONBOARDING
-- ============================================

-- Conquistas de primeira vez
CREATE TABLE IF NOT EXISTS first_time_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_code TEXT NOT NULL,
  coins_earned INTEGER DEFAULT 0,
  achieved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_code)
);

-- ============================================
-- 6. SESSÕES E SEGURANÇA
-- ============================================

-- Sessões ativas (para revogação)
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
-- RLS POLICIES
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

-- Wallet
CREATE POLICY "Users can view own wallet" ON wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON wallet FOR ALL USING (true);

-- Coin transactions (imutável)
CREATE POLICY "Users can view own transactions" ON coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON coin_transactions FOR INSERT WITH CHECK (true);

-- Coin packages
CREATE POLICY "Anyone can view active packages" ON coin_packages FOR SELECT USING (is_active = true);

-- Regional rankings
CREATE POLICY "Anyone can view rankings" ON regional_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage rankings" ON regional_rankings FOR ALL USING (true);

-- Ranking prizes
CREATE POLICY "Users can view own prizes" ON ranking_prizes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage prizes" ON ranking_prizes FOR ALL USING (true);

-- Store products
CREATE POLICY "Anyone can view active products" ON store_products FOR SELECT USING (is_active = true);

-- Store orders
CREATE POLICY "Users can view own orders" ON store_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON store_orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Store order items
CREATE POLICY "Users can view own items" ON store_order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM store_orders WHERE id = order_id AND user_id = auth.uid())
);

-- Store cart
CREATE POLICY "Users can manage own cart" ON store_cart FOR ALL USING (auth.uid() = user_id);

-- AI workout plans
CREATE POLICY "Users can view own plans" ON ai_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage plans" ON ai_workout_plans FOR ALL USING (true);

-- AI chat history
CREATE POLICY "Users can view own history" ON ai_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert history" ON ai_chat_history FOR INSERT WITH CHECK (true);

-- First time achievements
CREATE POLICY "Users can view own achievements" ON first_time_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON first_time_achievements FOR INSERT WITH CHECK (true);

-- Active sessions
CREATE POLICY "Users can view own sessions" ON active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON active_sessions FOR ALL USING (true);

-- ============================================
-- COINS PACKAGES INICIAIS
-- ============================================

INSERT INTO coin_packages (name, coins, price_brl, bonus_coins, is_popular) VALUES
('Pacote Básico', 100, 4.90, 0, false),
('Pacote Popular', 500, 19.90, 50, true),
('Pacote Premium', 1000, 34.90, 150, false),
('Pacote Mega', 2500, 79.90, 500, false),
('Pacote Ultra', 5000, 149.90, 1500, false)
ON CONFLICT DO NOTHING;

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_regional_rankings_region ON regional_rankings(region, city, points DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_user ON store_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_plans_user ON ai_workout_plans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user ON active_sessions(user_id, is_revoked);
