-- 1. FUNÇÃO TRIGGER PARA SINCRONIZAR ROLE DO PROFILE PARA O APP_METADATA DO AUTH.USERS
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CRIAR O TRIGGER
DROP TRIGGER IF EXISTS sync_profile_role_trigger ON public.profiles;
CREATE TRIGGER sync_profile_role_trigger
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role_to_auth_metadata();

-- 3. ATUALIZAR TODOS OS PERFIS EXISTENTES RETROATIVAMENTE (DISPARA O TRIGGER PARA CONTAS EXISTENTES)
UPDATE public.profiles SET role = role;

-- 4. OTIMIZAR AS POLÍTICAS DE RLS DE PROFILES PARA LER DO JWT
DROP POLICY IF EXISTS "Inserção de Perfis Autorizados" ON public.profiles;
CREATE POLICY "Inserção de Perfis Autorizados" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'manager', 'employee')
  );

DROP POLICY IF EXISTS "Atualização de Perfis Autorizados" ON public.profiles;
CREATE POLICY "Atualização de Perfis Autorizados" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'manager')
  );

DROP POLICY IF EXISTS "Exclusão Restrita de Perfis" ON public.profiles;
CREATE POLICY "Exclusão Restrita de Perfis" ON public.profiles
  FOR DELETE USING (
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'
  );

-- 5. OTIMIZAR AS POLÍTICAS DE RLS DE WORKOUTS PARA LER DO JWT
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
CREATE POLICY "Inserir treinos" ON public.workouts
  FOR INSERT WITH CHECK (
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'creator')
  );

DROP POLICY IF EXISTS "Atualizar treinos" ON public.workouts;
CREATE POLICY "Atualizar treinos" ON public.workouts
  FOR UPDATE USING (
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'creator')
  );

DROP POLICY IF EXISTS "Deletar treinos" ON public.workouts;
CREATE POLICY "Deletar treinos" ON public.workouts
  FOR DELETE USING (
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) IN ('admin', 'creator')
  );
