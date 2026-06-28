-- Adicionar coluna is_premium à tabela de treinos
ALTER TABLE public.workouts ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Marcar treinos de nível Avançado como premium por padrão
UPDATE public.workouts SET is_premium = TRUE WHERE level = 'Avançado';
