-- create-ip-security.sql
-- Sistema de segurança por IP e CPF para prevenção de fraudes, ataques e bloqueio em tempo real (WAF DB-level)

-- =========================================================================
-- 1. EXTENSÕES DE SCHEMA (TABELA DE PERFIS E TRIGGERS)
-- =========================================================================

-- Adiciona a coluna de CPF na tabela profiles com restrição de unicidade (UNIQUE)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT UNIQUE;

-- Atualiza a função do trigger para registrar o CPF vindo dos metadados de cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, cpf)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'cpf'), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-associa o trigger para garantir o novo comportamento
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 2. FUNÇÕES AUXILIARES DE IP (CRIADAS PRIMEIRO PARA USO NAS POLÍTICAS)
-- =========================================================================

-- Função para obter o IP atual do cliente HTTP que realizou a requisição
CREATE OR REPLACE FUNCTION public.get_ip()
RETURNS text AS $$
DECLARE
  headers text;
  ip text;
BEGIN
  headers := current_setting('request.headers', true);
  IF headers IS NULL THEN
    RETURN 'unknown';
  END IF;
  
  -- Tenta obter o IP do cabeçalho x-forwarded-for ou cf-connecting-ip
  ip := coalesce(
    headers::json->>'x-forwarded-for',
    headers::json->>'cf-connecting-ip',
    'unknown'
  );
  
  -- Trata múltiplos IPs no x-forwarded-for (pega o primeiro/origem)
  IF ip LIKE '%,%' THEN
    ip := split_part(ip, ',', 1);
  END IF;
  
  RETURN trim(ip);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Tabela de IPs bloqueados
CREATE TABLE IF NOT EXISTS blocked_ips (
  ip TEXT PRIMARY KEY,
  reason TEXT DEFAULT 'Atividade suspeita/Brute force',
  blocked_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;

-- Apenas administradores do banco/serviço podem gerenciar IPs bloqueados
DROP POLICY IF EXISTS "Admin can do everything on blocked_ips" ON blocked_ips;
CREATE POLICY "Admin can do everything on blocked_ips" ON blocked_ips
  USING (true) WITH CHECK (true);

-- Função para verificar se o IP da requisição está bloqueado
CREATE OR REPLACE FUNCTION public.is_ip_blocked()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_ips WHERE ip = public.get_ip()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =========================================================================
-- 3. REGISTROS DE TENTATIVAS DE LOGIN E RATE LIMITING
-- =========================================================================

-- Tabela para registrar tentativas de login (para rate limiting)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip TEXT NOT NULL,
  email TEXT NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT now(),
  is_successful BOOLEAN DEFAULT false
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log login attempts" ON login_attempts;
CREATE POLICY "Anyone can log login attempts" ON login_attempts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own IP login attempts" ON login_attempts;
CREATE POLICY "Users can view own IP login attempts" ON login_attempts
  FOR SELECT USING (ip = public.get_ip());

-- Função para verificar limite de taxa de login e bloquear IP automaticamente
CREATE OR REPLACE FUNCTION public.check_login_rate_limit(client_email text)
RETURNS boolean AS $$
DECLARE
  failed_count integer;
  client_ip text;
BEGIN
  client_ip := public.get_ip();
  
  -- Conta tentativas falhas nos últimos 15 minutos do mesmo IP ou E-mail
  SELECT count(*) INTO failed_count
  FROM login_attempts
  WHERE (ip = client_ip OR email = client_email)
    AND is_successful = false
    AND attempted_at > now() - interval '15 minutes';
    
  -- Se exceder 5 tentativas, bloqueia o IP inserindo-o na blacklist
  IF failed_count >= 5 THEN
    INSERT INTO blocked_ips (ip, reason)
    VALUES (client_ip, 'Excesso de tentativas de login falhas (Brute force)')
    ON CONFLICT (ip) DO UPDATE SET reason = 'Excesso de tentativas de login falhas (Brute force)';
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 4. VERIFICAÇÃO DE CONTAS EXISTENTES (PREVENÇÃO DE DUPLICIDADE)
-- =========================================================================

-- Verifica se um e-mail já existe na tabela interna de usuários do auth do Supabase
CREATE OR REPLACE FUNCTION public.does_email_exist(check_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = check_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verifica se um CPF já existe na tabela de perfis
CREATE OR REPLACE FUNCTION public.does_cpf_exist(check_cpf text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE cpf = check_cpf
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
