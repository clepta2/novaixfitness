-- ============================================
-- NOVAIX FITNESS - SEGURANÇA DE CRIADOR DE TREINOS
-- ============================================

-- 1. Adicionar coluna creator_id à tabela workouts
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 2. Atualizar políticas de RLS para workouts de forma estrita
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
      ) AND
      COALESCE(creator_id, auth.uid()) = auth.uid()
    )
  );

-- Permitir atualização apenas para admins ou o próprio coach criador
CREATE POLICY "Atualizar treinos" ON public.workouts
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      ) AND
      creator_id = auth.uid()
    )
  );

-- Permitir deleção apenas para admins ou o próprio coach criador
CREATE POLICY "Deletar treinos" ON public.workouts
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      ) AND
      creator_id = auth.uid()
    )
  );
