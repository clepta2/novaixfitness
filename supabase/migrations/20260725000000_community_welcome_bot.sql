-- ============================================
-- NOVAIX FITNESS - COMMUNITY WELCOME BOT AND SEED DATA
-- ============================================

-- 1. Inserir primeiro em auth.users para satisfazer a chave estrangeira em profiles
INSERT INTO auth.users (id, email, aud, role, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'coach-bot@novaix.com',
  'authenticated',
  'authenticated',
  '{"name": "Nix Coach (IA)", "role": "creator"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Atualizar ou garantir que o perfil na tabela public.profiles esteja correto
INSERT INTO public.profiles (id, name, email, role, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Nix Coach (IA)',
  'coach-bot@novaix.com',
  'creator',
  'https://novaixfitness.com/assets/bot-avatar.png'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  avatar_url = EXCLUDED.avatar_url;

-- Inserir perfil de criador do Bot
INSERT INTO public.creator_profiles (user_id, display_name, bio, category, is_verified, status)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Nix Coach',
  'Seu assistente virtual e coach oficial do NOVAIX FITNESS. Aqui para guiar seus treinos e alimentação de forma inteligente.',
  'fitness',
  true,
  'active'
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  is_verified = EXCLUDED.is_verified,
  status = EXCLUDED.status;

-- 3. Inserir posts sementes (Seed Data) da comunidade
INSERT INTO public.posts (id, user_id, content, likes_count, comments_count, created_at)
VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'Bem-vindos ao NOVAIX FITNESS! 🚀 Começamos hoje nosso desafio mensal. Publique sua foto de treino ou sua refeição saudável no feed e utilize a hashtag #DesafioNix para somar pontos extras no ranking da sua região! Qual o seu treino de hoje?',
  12,
  2,
  NOW() - INTERVAL '2 hours'
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'Dica do Dia do Nix: A hidratação é o pilar mais negligenciado na hipertrofia e na perda de gordura. Tente manter o consumo mínimo de 35ml de água para cada kg de peso corporal. Use o nosso WaterTracker para não esquecer de registrar!',
  25,
  1,
  NOW() - INTERVAL '5 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Criar a função do trigger para o Welcome Bot
CREATE OR REPLACE FUNCTION public.handle_new_post_welcome()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  post_count INTEGER;
BEGIN
  -- Verificar se é o primeiro post do usuário
  SELECT COUNT(*) INTO post_count FROM public.posts WHERE user_id = NEW.user_id;
  
  -- Ignorar posts do próprio Bot
  IF NEW.user_id = '00000000-0000-0000-0000-000000000000' THEN
    RETURN NEW;
  END IF;

  IF post_count = 1 THEN
    -- Obter o nome do atleta
    SELECT name INTO user_name FROM public.profiles WHERE id = NEW.user_id;
    
    -- Inserir comentário de boas-vindas do Coach Nix
    INSERT INTO public.post_comments (post_id, user_id, content, created_at)
    VALUES (
      NEW.id,
      '00000000-0000-0000-0000-000000000000',
      'Olá ' || COALESCE(user_name, 'atleta') || '! Seja muito bem-vindo(a) à comunidade NOVAIX FITNESS! 💪 Eu sou o Nix, seu coach de IA. Vi que este é seu primeiro post por aqui. Conta pra gente: qual o seu principal objetivo nessa jornada?',
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar o trigger de inserção de post
DROP TRIGGER IF EXISTS on_new_post_welcome_trigger ON public.posts;
CREATE TRIGGER on_new_post_welcome_trigger
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_post_welcome();
