-- =========================================================================
-- NOVAIX FITNESS - Tabelas Adicionais para Controle e Histórico Detalhado
-- Progresso Corporal, Cargas/Repetições e Controle de Água
-- =========================================================================

-- 1. TABELA DE PROGRESSO FÍSICO (PHYSICAL PROGRESS)
-- Permite registrar pesagem e medidas periódicas para gráficos de evolução
CREATE TABLE IF NOT EXISTS public.physical_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight NUMERIC(5,2),                      -- Ex: 78.50 kg
  height NUMERIC(5,2),                      -- Ex: 175.00 cm
  body_fat NUMERIC(4,1),                    -- Ex: 14.5%
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE REGISTRO DE SÉRIES/EXERCÍCIOS (USER EXERCISE LOGS)
-- Registra a carga e repetições executadas em cada série individualmente
CREATE TABLE IF NOT EXISTS public.user_exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id UUID NOT NULL REFERENCES public.user_workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,              -- Ex: "Supino Reto"
  set_number INTEGER NOT NULL,              -- Ex: 1, 2, 3, 4
  reps_done INTEGER NOT NULL,               -- Ex: 10
  weight_kg NUMERIC(6,2) DEFAULT 0,         -- Ex: 30.00 kg
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE CONSUMO DE ÁGUA (WATER LOGS)
-- Acompanhamento diário de ingestão de água
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,               -- Ex: 500 ml
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.physical_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- =========================================================================

-- Políticas para physical_progress
CREATE POLICY "Ver próprio progresso físico" ON public.physical_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Registrar próprio progresso físico" ON public.physical_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar próprio progresso físico" ON public.physical_progress FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_exercise_logs (verifica posse do treino de referência)
CREATE POLICY "Ver meus registros de exercícios" ON public.user_exercise_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_workouts
    WHERE public.user_workouts.id = user_workout_id AND public.user_workouts.user_id = auth.uid()
  )
);
CREATE POLICY "Registrar meus treinos/exercícios" ON public.user_exercise_logs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_workouts
    WHERE public.user_workouts.id = user_workout_id AND public.user_workouts.user_id = auth.uid()
  )
);
CREATE POLICY "Deletar meus registros de exercícios" ON public.user_exercise_logs FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.user_workouts
    WHERE public.user_workouts.id = user_workout_id AND public.user_workouts.user_id = auth.uid()
  )
);

-- Políticas para water_logs
CREATE POLICY "Ver minha hidratação" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Registrar minha hidratação" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar minha hidratação" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);
