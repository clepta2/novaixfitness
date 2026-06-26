-- =============================================
-- NOVAIX FITNESS - Tabelas de Pagamento (Asaas)
-- Execute no Supabase > SQL Editor > Run
-- =============================================

-- Adicionar colunas de Asaas na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT;

-- Tabela de pagamentos
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

-- Tabela de assinaturas
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

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLITICAS DE SEGURANCA
-- =============================================

-- Payments
CREATE POLICY "Ver meus pagamentos" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir meus pagamentos" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meus pagamentos" ON payments FOR UPDATE USING (auth.uid() = user_id);

-- Subscriptions
CREATE POLICY "Ver minhas assinaturas" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Inserir minha assinatura" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar minha assinatura" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- INDEX
-- =============================================

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_asaas_id ON payments(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_id ON subscriptions(asaas_subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_asaas_customer ON profiles(asaas_customer_id);
