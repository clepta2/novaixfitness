-- Cria tabela admin_2fa para auticação em dois fatores
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admin_2fa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- RLS: admin só vê seus próprios dados
ALTER TABLE admin_2fa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin 2FA own data" ON admin_2fa
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para lookup rápido
CREATE INDEX IF NOT EXISTS idx_admin_2fa_user_id ON admin_2fa(user_id);
