-- 20260731000000_coach_commissions.sql
-- Sistema de comissões e saques para Coaches - NOVAIX FITNESS

-- Tabela de comissões do coach (vinculada a assinaturas geradas)
CREATE TABLE IF NOT EXISTS public.coach_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL DEFAULT 'subscription'
    CHECK (source_type IN ('subscription', 'workout_sale', 'content_sale', 'referral')),
  source_id TEXT,
  subscriber_id UUID REFERENCES profiles(id),
  gross_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(3,2) NOT NULL DEFAULT 0.70,
  net_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'available', 'requested', 'paid', 'cancelled')),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de saques do coach
CREATE TABLE IF NOT EXISTS public.coach_withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  pix_key TEXT NOT NULL,
  pix_key_type TEXT NOT NULL
    CHECK (pix_key_type IN ('CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  asaas_transfer_id TEXT,
  processed_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_coach_commissions_coach
  ON public.coach_commissions(coach_id, status);

CREATE INDEX IF NOT EXISTS idx_coach_commissions_period
  ON public.coach_commissions(coach_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coach_withdrawals_coach
  ON public.coach_withdrawals(coach_id, status);

-- RLS
ALTER TABLE public.coach_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_withdrawals ENABLE ROW LEVEL SECURITY;

-- Coaches veem suas próprias comissões
CREATE POLICY "Coaches view own commissions"
  ON public.coach_commissions FOR SELECT
  USING (auth.uid() = coach_id);

-- Admins veem todas as comissões
CREATE POLICY "Admins view all commissions"
  ON public.coach_commissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'superadmin')
    )
  );

-- Service role insere comissões (via backend)
CREATE POLICY "Service insert commissions"
  ON public.coach_commissions FOR INSERT
  WITH CHECK (true);

-- Coaches veem seus próprios saques
CREATE POLICY "Coaches view own withdrawals"
  ON public.coach_withdrawals FOR SELECT
  USING (auth.uid() = coach_id);

-- Service role gerencia saques
CREATE POLICY "Service manage withdrawals"
  ON public.coach_withdrawals FOR ALL
  USING (true) WITH CHECK (true);

-- Função para calcular saldo disponível do coach
CREATE OR REPLACE FUNCTION public.get_coach_balance(p_coach_id UUID)
RETURNS TABLE(
  total_earned DECIMAL,
  available_balance DECIMAL,
  pending_amount DECIMAL,
  withdrawn_amount DECIMAL,
  commission_count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(cc.net_amount), 0)::DECIMAL AS total_earned,
    COALESCE(SUM(CASE WHEN cc.status = 'available' THEN cc.net_amount ELSE 0 END), 0)::DECIMAL AS available_balance,
    COALESCE(SUM(CASE WHEN cc.status = 'pending' THEN cc.net_amount ELSE 0 END), 0)::DECIMAL AS pending_amount,
    COALESCE((SELECT SUM(cw.amount) FROM coach_withdrawals cw WHERE cw.coach_id = p_coach_id AND cw.status = 'completed'), 0)::DECIMAL AS withdrawn_amount,
    COUNT(cc.id) AS commission_count
  FROM coach_commissions cc
  WHERE cc.coach_id = p_coach_id
  AND cc.status != 'cancelled';
END;
$$;
