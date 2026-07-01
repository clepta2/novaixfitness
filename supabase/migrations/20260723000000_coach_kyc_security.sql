-- ============================================
-- NOVAIX FITNESS - COACH KYC MIGRATION (Self-Healing)
-- ============================================

-- 1. Criar a tabela creator_profiles se ela não existir
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  category TEXT DEFAULT 'fitness',
  is_verified BOOLEAN DEFAULT false,
  subscriber_count INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  commission_rate DECIMAL(3,2) DEFAULT 0.70,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended','pending')),
  cref TEXT,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Garantir que as colunas cref e document_url existam caso a tabela já existisse
ALTER TABLE public.creator_profiles ADD COLUMN IF NOT EXISTS cref TEXT;
ALTER TABLE public.creator_profiles ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 3. Habilitar RLS e criar políticas para creator_profiles
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view creators" ON public.creator_profiles;
DROP POLICY IF EXISTS "Users can manage own creator profile" ON public.creator_profiles;
CREATE POLICY "Anyone can view creators" ON public.creator_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own creator profile" ON public.creator_profiles FOR ALL USING (auth.uid() = user_id);

-- 4. Recriar políticas de RLS para workouts de forma segura
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
DROP POLICY IF EXISTS "Atualizar treinos" ON public.workouts;
DROP POLICY IF EXISTS "Deletar treinos" ON public.workouts;

-- Permitir inserção apenas para admins ou coaches (creator) que estejam verificados e ativos
CREATE POLICY "Inserir treinos" ON public.workouts
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      )
    )
  );

-- Permitir atualização apenas para admins ou o próprio coach verificado
CREATE POLICY "Atualizar treinos" ON public.workouts
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      )
    )
  );

-- Permitir deleção apenas para admins ou o próprio coach verificado
CREATE POLICY "Deletar treinos" ON public.workouts
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      )
    )
  );
