-- =========================================================================
-- NOVAIX FITNESS - Migração de Banco de Dados e Triggers (Modo Debug)
-- Execute este script no SQL Editor para expor erros de criação de perfil!
-- =========================================================================

-- 1. CORRIGIR E ESTENDER A TABELA DE TREINOS (WORKOUTS)
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS video_id TEXT;
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS equipment JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS exercises JSONB DEFAULT '[]'::jsonb;

-- 2. CORRIGIR E ESTENDER A TABELA DE PERFIS (PROFILES)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_workouts INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_minutes INTEGER DEFAULT 0;

-- 3. RESETAR E ATUALIZAR FUNÇÃO E TRIGGER (SEM SILENCIAR ERROS)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, subscription_status, streak, total_workouts, total_minutes)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Atleta'),
    'free',
    0,
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
