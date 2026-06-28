-- Suporte a múltiplos tutoriais por tela
-- Execute no Supabase SQL Editor

-- Adiciona coluna para armazenar tutoriais completados como JSON
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS tutorials_completed JSONB DEFAULT '{}';

-- Migra dados existentes do tutorial principal
UPDATE profiles
SET tutorials_completed = '{"home": true}'
WHERE tutorial_completed = true;

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_profiles_tutorials_completed 
ON profiles USING gin (tutorials_completed);
