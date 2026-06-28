-- Fix security policies - NOVAIX FITNESS
-- Executar no SQL Editor do Supabase

-- 1. blocked_ips: restringir acesso (funcoes SECURITY DEFINER bypassam RLS)
DROP POLICY IF EXISTS "Admin can do everything on blocked_ips" ON blocked_ips;
CREATE POLICY "Service role manages blocked_ips" ON blocked_ips
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2. workouts: apenas service_role pode inserir (dados devem vir do admin/backend)
DROP POLICY IF EXISTS "Inserir treinos" ON public.workouts;
CREATE POLICY "Service role inserts workouts" ON public.workouts
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 3. testimonials: exigir autenticacao para criar
DROP POLICY IF EXISTS "Criar depoimento publico" ON testimonials;
CREATE POLICY "Authenticated users create testimonials" ON testimonials
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4. login_attempts: manter INSERT publico (necessario para rate limit no client)
-- ja esta correto, sem alteracao

-- 5. forum_posts: restringir INSERT para autenticados
DROP POLICY IF EXISTS "Ver posts do forum" ON forum_posts;
CREATE POLICY "Anyone reads forum posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users create forum posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 6. forum_replies: restringir INSERT para autenticados
DROP POLICY IF EXISTS "Ver respostas" ON forum_replies;
CREATE POLICY "Anyone reads forum replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users create forum replies" ON forum_replies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 7. analytics_events: manter INSERT publico (crash reporting)
-- ja esta correto, sem alteracao
