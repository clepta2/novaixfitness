-- ============================================
-- SISTEMA DE VIRTUAL GIFTING
-- Moeda interna + Presentes + Ranking
-- ============================================

-- 1. Carteira do usuário (moeda interna)
CREATE TABLE IF NOT EXISTS wallet (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Catálogo de presentes
CREATE TABLE IF NOT EXISTS gift_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  coin_value INTEGER NOT NULL,
  animation TEXT DEFAULT 'bounce',
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transações de presentes
CREATE TABLE IF NOT EXISTS gift_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  gift_id UUID REFERENCES gift_catalog(id),
  live_id UUID REFERENCES live_workouts(id),
  coins_spent INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ranking de doadores
CREATE TABLE IF NOT EXISTS gift_rankings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_coins_sent INTEGER DEFAULT 0,
  total_gifts_sent INTEGER DEFAULT 0,
  total_coins_received INTEGER DEFAULT 0,
  total_gifts_received INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Pacotes de coins
CREATE TABLE IF NOT EXISTS coin_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coins INTEGER NOT NULL,
  price_brl DECIMAL(10,2) NOT NULL,
  bonus_coins INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_gift_tx_sender ON gift_transactions(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_tx_receiver ON gift_transactions(receiver_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_tx_live ON gift_transactions(live_id, created_at DESC);

-- RLS
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage wallets" ON wallet FOR ALL USING (true);

CREATE POLICY "Anyone can view active gifts" ON gift_catalog FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage catalog" ON gift_catalog FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view gifts" ON gift_transactions FOR SELECT USING (true);
CREATE POLICY "System can insert gifts" ON gift_transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view rankings" ON gift_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage rankings" ON gift_rankings FOR ALL USING (true);

CREATE POLICY "Anyone can view packages" ON coin_packages FOR SELECT USING (is_active = true);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Presentes
INSERT INTO gift_catalog (name, emoji, coin_value, animation, rarity) VALUES
('Fogo', '🔥', 5, 'bounce', 'common'),
('Força', '💪', 10, 'pulse', 'common'),
('Estrela', '⭐', 25, 'spin', 'rare'),
('Diamante', '💎', 50, 'glow', 'rare'),
('Coroa', '👑', 100, 'float', 'epic'),
('Troféu', '🏆', 200, 'shine', 'epic'),
('Unicórnio', '🦄', 500, 'rainbow', 'legendary'),
('Fênix', '🔥', 1000, 'explode', 'legendary');

-- Pacotes de coins
INSERT INTO coin_packages (coins, price_brl, bonus_coins, is_popular) VALUES
(100, 4.90, 0, false),
(500, 19.90, 50, false),
(1000, 34.90, 150, true),
(2500, 79.90, 500, false),
(5000, 149.90, 1500, false);

-- ============================================
-- FUNÇÕES RPC
-- ============================================

-- Comprar coins
CREATE OR REPLACE FUNCTION buy_coins(p_user_id UUID, p_package_id UUID)
RETURNS JSONB AS $$
DECLARE
  pkg RECORD;
  current_balance INTEGER;
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

  -- Debitar remetente
  UPDATE wallet SET
    balance = balance - gift.coin_value,
    total_spent = total_spent + gift.coin_value,
    updated_at = NOW()
  WHERE user_id = p_sender_id;

  -- Creditar destinatário (70%)
  INSERT INTO wallet (user_id, balance, total_earned)
  VALUES (p_receiver_id, FLOOR(gift.coin_value * 0.7), FLOOR(gift.coin_value * 0.7))
  ON CONFLICT (user_id) DO UPDATE SET
    balance = wallet.balance + FLOOR(gift.coin_value * 0.7),
    total_earned = wallet.total_earned + FLOOR(gift.coin_value * 0.7),
    updated_at = NOW();

  -- Registrar transação
  INSERT INTO gift_transactions (sender_id, receiver_id, gift_id, live_id, coins_spent, message)
  VALUES (p_sender_id, p_receiver_id, p_gift_id, p_live_id, gift.coin_value, p_message);

  -- Atualizar rankings
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
