-- ============================================
-- NOVAIX FITNESS - NÍVEIS DE ADMINISTRADORES (RBAC MULTI-LEVEL)
-- ============================================

-- 1. Atualizar constraint de cargos (roles) na tabela public.profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'creator', 'superadmin', 'admin', 'community_admin', 'workout_admin'));

-- 2. Atualizar políticas de RLS da tabela workouts para incluir superadmin e workout_admin
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
DROP POLICY IF EXISTS "Atualizar treinos" ON public.workouts;
DROP POLICY IF EXISTS "Deletar treinos" ON public.workouts;

-- Permitir inserção para superadmin, admin, workout_admin, ou o próprio coach verificado/ativo
CREATE POLICY "Inserir treinos" ON public.workouts
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'admin', 'workout_admin') OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      ) AND
      COALESCE(creator_id, auth.uid()) = auth.uid()
    )
  );

-- Permitir atualização para superadmin, admin, workout_admin, ou o próprio coach verificado/ativo
CREATE POLICY "Atualizar treinos" ON public.workouts
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'admin', 'workout_admin') OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      ) AND
      creator_id = auth.uid()
    )
  );

-- Permitir deleção para superadmin, admin, workout_admin, ou o próprio coach verificado/ativo
CREATE POLICY "Deletar treinos" ON public.workouts
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('superadmin', 'admin', 'workout_admin') OR
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'creator' AND
      EXISTS (
        SELECT 1 FROM public.creator_profiles 
        WHERE user_id = auth.uid() AND is_verified = true AND status = 'active'
      ) AND
      creator_id = auth.uid()
    )
  );
