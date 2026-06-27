-- Adiciona campos de tutorial na tabela profiles
-- Execute no Supabase SQL Editor

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS tutorial_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tutorial_skipped BOOLEAN DEFAULT false;
