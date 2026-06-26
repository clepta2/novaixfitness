-- =========================================================================
-- NOVAIX FITNESS - Schema Completo e Detalhado do Banco de Dados (Supabase)
-- Versão Pro: Comunidade, Curtidas, Comentários, Feedbacks e Vídeos.
-- =========================================================================

-- 1. EXTENSÕES ÚTEIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE PERFIS (PROFILES)
-- Extende a tabela auth.users nativa do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  onboarding JSONB DEFAULT '{}'::jsonb,
  physical_data JSONB DEFAULT '{}'::jsonb, -- Peso, altura, metas, BF%, etc.
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'canceled')),
  subscription_plan TEXT,                  -- Mensal, trimestral, anual
  streak INTEGER DEFAULT 0,                -- Dias consecutivos de treino
  total_workouts INTEGER DEFAULT 0,        -- Treinos finalizados
  total_minutes INTEGER DEFAULT 0,         -- Minutos acumulados em treinos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE TREINOS (WORKOUTS)
-- Cadastro centralizado de treinos disponíveis no app
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,                     -- Ex: "Treino A: Peito e Tríceps"
  name TEXT,                               -- Nome alternativo / simplificado
  description TEXT,                        -- Descrição detalhada do objetivo
  category TEXT,                           -- Ex: "Musculação", "Cardio", "Yoga"
  level TEXT CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado')),
  duration INTEGER DEFAULT 0,              -- Duração estimada em minutos
  video_url TEXT,                          -- URL completa do streaming (YouTube/Vimeo)
  video_id TEXT,                           -- ID do player (ex: dQw4w9WgXcQ)
  thumbnail_url TEXT,                      -- Banner do treino
  equipment JSONB DEFAULT '[]'::jsonb,     -- Lista de equipamentos necessários (ex: ["Halteres", "Banco"])
  tags JSONB DEFAULT '[]'::jsonb,          -- Tags de agrupamento (ex: ["Hipertrofia", "Foco Peito"])
  exercises JSONB DEFAULT '[]'::jsonb,     -- Estrutura dos exercícios (ex: [{"name": "Supino", "sets": 4, "reps": 10}])
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE TREINOS CONCLUÍDOS PELO USUÁRIO (USER_WORKOUTS)
-- Histórico e registro de execuções de treinos
CREATE TABLE IF NOT EXISTS public.user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL, -- Permite NULL se o treino original for excluído
  completed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  duration INTEGER DEFAULT 0,              -- Minutos reais gastos no treino
  rating INTEGER CHECK (rating BETWEEN 1 AND 5), -- Avaliação de 1 a 5 estrelas
  notes TEXT,                              -- Feedback do usuário sobre o rendimento
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE FAVORITOS (FAVORITES)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workout_id)
);

-- 6. TABELA DE COMENTÁRIOS DE TREINOS (WORKOUT_COMMENTS)
-- Feedback e seção de comentários nos treinos específicos
CREATE TABLE IF NOT EXISTS public.workout_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE LIKES EM TREINOS (WORKOUT_LIKES)
-- Usuários podem curtir treinos específicos
CREATE TABLE IF NOT EXISTS public.workout_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, user_id)
);

-- 8. TABELA DE POSTS DA COMUNIDADE (POSTS)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE CURTIDAS EM POSTS (POST_LIKES)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 10. TABELA DE COMENTÁRIOS EM POSTS (POST_COMMENTS)
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- POLÍTICAS DE SEGURANÇA (RLS POLICIES)
-- =========================================================================

-- Profiles
CREATE POLICY "Ver próprio perfil ou qualquer perfil" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Atualizar próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Inserir próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Workouts
CREATE POLICY "Ver todos os treinos" ON public.workouts FOR SELECT USING (true);

-- User Workouts
CREATE POLICY "Ver meus treinos concluídos" ON public.user_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Registrar meus treinos concluídos" ON public.user_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meus registros de treino" ON public.user_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Excluir meu registro de treino" ON public.user_workouts FOR DELETE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Ver meus favoritos" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Adicionar favorito" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remover favorito" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Workout Comments
CREATE POLICY "Ver comentários do treino" ON public.workout_comments FOR SELECT USING (true);
CREATE POLICY "Escrever comentário no treino" ON public.workout_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar meu comentário do treino" ON public.workout_comments FOR DELETE USING (auth.uid() = user_id);

-- Workout Likes
CREATE POLICY "Ver curtidas do treino" ON public.workout_likes FOR SELECT USING (true);
CREATE POLICY "Curtir treino" ON public.workout_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remover curtida do treino" ON public.workout_likes FOR DELETE USING (auth.uid() = user_id);

-- Posts da Comunidade
CREATE POLICY "Ver todos os posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Criar post" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar meu post" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Deletar meu post" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Post Likes
CREATE POLICY "Ver curtidas dos posts" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Curtir post" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remover curtida do post" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post Comments
CREATE POLICY "Ver comentários dos posts" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Comentar em post" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Deletar meu comentário em post" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- =========================================================================
-- TRIGGERS E FUNÇÕES AUXILIARES
-- =========================================================================

-- Trigger para automatizar a criação de perfil de usuário ao fazer cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário Antigravidade')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para contagem automática de curtidas em posts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Trigger para contagem automática de comentários em posts
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();
