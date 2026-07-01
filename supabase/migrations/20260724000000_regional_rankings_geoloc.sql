-- ============================================
-- NOVAIX FITNESS - GEOLOCALIZAÇÃO E RANKINGS REGIONAIS
-- ============================================

-- 1. Adicionar colunas de geolocalização à tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS neighborhood TEXT;

-- 2. Criar índices para otimização de consultas de geolocalização
CREATE INDEX IF NOT EXISTS idx_profiles_geoloc ON public.profiles(state, city, neighborhood);

-- 3. Garantir a existência da tabela regional_rankings
CREATE TABLE IF NOT EXISTS public.regional_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- Habilitar RLS e criar políticas para regional_rankings
ALTER TABLE public.regional_rankings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view rankings" ON public.regional_rankings;
DROP POLICY IF EXISTS "System can manage rankings" ON public.regional_rankings;
CREATE POLICY "Anyone can view rankings" ON public.regional_rankings FOR SELECT USING (true);
CREATE POLICY "System can manage rankings" ON public.regional_rankings FOR ALL USING (true);
