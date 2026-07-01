-- supabase/migrations/20260629_add_subscribed_at_to_profiles.sql
-- Adiciona coluna subscribed_at para registrar quando o usuário assinou um plano

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMPTZ;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';

COMMENT ON COLUMN public.profiles.subscribed_at IS 'Timestamp de quando o usuário assinou o plano';
COMMENT ON COLUMN public.profiles.subscription_plan IS 'ID do plano assinado: basic, intermediate, premium, ultra';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Status da assinatura: free, active, canceled';
