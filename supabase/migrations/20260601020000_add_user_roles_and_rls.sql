-- 1. ADICIONAR COLUNA DE CARGO (ROLE) À TABELA PROFILES COM SUPORTE AO CARGO CREATOR
-- Se a coluna já existia sem a restrição correta, removemos a restrição antiga e adicionamos a nova.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'employee', 'manager', 'admin', 'creator'));

-- 2. ATUALIZAR FUNÇÃO DO TRIGGER DE CADASTRO PARA CAPTURAR O CARGO DOS METADADOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, subscription_status, streak, total_workouts, total_minutes, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'Atleta'),
    'free',
    0,
    0,
    0,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RESETAR E ATUALIZAR AS POLÍTICAS DE RLS NA TABELA PROFILES
DROP POLICY IF EXISTS "Ver proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Atualizar proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Inserir proprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Leitura de Perfis Autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Inserção de Perfis Autorizados" ON public.profiles;
DROP POLICY IF EXISTS "Atualização de Perfis Autorizados" ON public.profiles;
DROP POLICY IF EXISTS "Exclusão Restrita de Perfis" ON public.profiles;

-- Política de Leitura: Usuários autenticados podem ver perfis
CREATE POLICY "Leitura de Perfis Autenticados" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política de Inserção: O próprio usuário pode inserir seu perfil (signup padrão), ou funcionários autorizados (excluindo creator)
CREATE POLICY "Inserção de Perfis Autorizados" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager', 'employee')
  );

-- Política de Atualização: O próprio usuário pode atualizar suas informações, ou admin/gerentes podem atualizar tudo
CREATE POLICY "Atualização de Perfis Autorizados" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Política de Exclusão: Apenas admins podem excluir perfis de usuário
CREATE POLICY "Exclusão Restrita de Perfis" ON public.profiles
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- 4. ATUALIZAR E PROTEGER AS POLÍTICAS DE RLS NA TABELA DE TREINOS (WORKOUTS)
DROP POLICY IF EXISTS "Ver treinos" ON public.workouts;
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
DROP POLICY IF EXISTS "Atualizar treinos" ON public.workouts;
DROP POLICY IF EXISTS "Deletar treinos" ON public.workouts;

-- Permitir leitura pública/autenticada de treinos
CREATE POLICY "Ver treinos" ON public.workouts
  FOR SELECT USING (true);

-- Apenas Admin e Criador de Conteúdo (creator) podem inserir treinos
CREATE POLICY "Inserir treinos" ON public.workouts
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'creator')
  );

-- Apenas Admin e Criador de Conteúdo (creator) podem atualizar treinos
CREATE POLICY "Atualizar treinos" ON public.workouts
  FOR UPDATE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'creator')
  );

-- Apenas Admin e Criador de Conteúdo (creator) podem deletar treinos
CREATE POLICY "Deletar treinos" ON public.workouts
  FOR DELETE USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'creator')
  );
