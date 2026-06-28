-- add-onboarding-payment-fields.sql
-- Adiciona colunas para controle de progresso de onboarding e pagamento na tabela profiles
-- Execute no SQL Editor do Supabase Dashboard

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT 'onboarding';

-- Usuários já existentes que não passaram pelo novo fluxo ficam em 'onboarding'
-- (não é necessário UPDATE — o valor DEFAULT 'onboarding' já cobre os novos registros)
-- Para usuários existentes que já completaram tudo, atualize manualmente:
-- UPDATE public.profiles SET current_step = 'home' WHERE subscription_active = true;
