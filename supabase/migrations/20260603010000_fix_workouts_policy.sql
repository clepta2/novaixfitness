-- Corrigir politicas da tabela workouts no Supabase
-- Cole no SQL Editor e rode para permitir inserção de dados nos treinos

-- Habilitar inserção para administradores/serviços de seeding (ou temporariamente para todos)
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
CREATE POLICY "Inserir treinos" ON public.workouts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Ver treinos" ON public.workouts;
CREATE POLICY "Ver treinos" ON public.workouts FOR SELECT USING (true);
