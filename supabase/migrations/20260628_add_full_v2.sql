-- Migracao NOVAIX FITNESS V2 - 2026-06-28
-- Execute no SQL Editor do Supabase

-- 1. TABELA: Novo onboarding
CREATE TABLE IF NOT EXISTS onboarding_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  goal TEXT,
  age_range TEXT,
  gender TEXT,
  weight NUMERIC,
  height NUMERIC,
  cep TEXT,
  state TEXT,
  city TEXT,
  body_model TEXT,
  level TEXT,
  days_per_week INTEGER,
  workout_location TEXT,
  gym_type TEXT,
  injuries JSONB DEFAULT '[]',
  preferred_time TEXT,
  stress_sleep TEXT,
  preferred_muscles JSONB DEFAULT '[]',
  dietary_restrictions TEXT,
  instructor_type TEXT,
  notification_channels JSONB DEFAULT '[]',
  notification_types JSONB DEFAULT '[]',
  referral_source TEXT,
  current_step TEXT DEFAULT 'start',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE onboarding_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_meu_onboarding" ON onboarding_v2 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_onboarding" ON onboarding_v2 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar_onboarding" ON onboarding_v2 FOR UPDATE USING (auth.uid() = user_id);

-- 2. TABELA: Lesoes detalhadas
CREATE TABLE IF NOT EXISTS injury_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body_part TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  date_reported DATE DEFAULT CURRENT_DATE,
  date_resolved DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'improving', 'resolved', 'chronic')),
  recovery_estimated_weeks INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE injury_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_minhas_lesoes" ON injury_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_lesao" ON injury_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar_lesao" ON injury_details FOR UPDATE USING (auth.uid() = user_id);

-- 3. TABELA: Check-ins de lesao
CREATE TABLE IF NOT EXISTS injury_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injury_id UUID REFERENCES injury_details(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  improvement TEXT CHECK (improvement IN ('worse', 'same', 'better', 'resolved')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE injury_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_checkins" ON injury_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_checkin" ON injury_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. TABELA: Fotos de lesao
CREATE TABLE IF NOT EXISTS injury_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injury_id UUID REFERENCES injury_details(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('initial', 'progress', 'resolved')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE injury_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_fotos" ON injury_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar_foto" ON injury_photos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. TABELA: Testes de movimento
CREATE TABLE IF NOT EXISTS movement_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injury_id UUID REFERENCES injury_details(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  movement TEXT NOT NULL,
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  can_perform BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE movement_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_testes" ON movement_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_teste" ON movement_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. TABELA: Feedback pos-exercicio
CREATE TABLE IF NOT EXISTS exercise_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  injury_id UUID REFERENCES injury_details(id),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exercise_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_feedback" ON exercise_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_feedback" ON exercise_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. TABELA: Correlacao treino-lesao
CREATE TABLE IF NOT EXISTS injury_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  injury_id UUID REFERENCES injury_details(id),
  workout_type TEXT,
  pain_before INTEGER,
  pain_after INTEGER,
  correlation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE injury_correlations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_correlacoes" ON injury_correlations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_correlacao" ON injury_correlations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. TABELA: Check-in pre-treino
CREATE TABLE IF NOT EXISTS pre_workout_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT CHECK (mood IN ('great', 'good', 'regular', 'bad', 'terrible')),
  notes TEXT,
  workout_adjusted BOOLEAN DEFAULT false,
  adjustment_type TEXT,
  selected_option TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pre_workout_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_checkins_pre" ON pre_workout_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_checkin_pre" ON pre_workout_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. TABELA: Revisao mensal
CREATE TABLE IF NOT EXISTS monthly_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  workouts_completed INTEGER,
  workouts_total INTEGER,
  completion_rate NUMERIC,
  strength_change NUMERIC,
  weight_change NUMERIC,
  mood TEXT,
  action_taken TEXT,
  new_plan_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE monthly_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_revisoes" ON monthly_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_revisao" ON monthly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. TABELA: Metas de curto prazo
CREATE TABLE IF NOT EXISTS short_term_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value NUMERIC,
  target_unit TEXT,
  target_days INTEGER DEFAULT 30,
  current_value NUMERIC DEFAULT 0,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE short_term_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_metas" ON short_term_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_meta" ON short_term_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar_meta" ON short_term_goals FOR UPDATE USING (auth.uid() = user_id);

-- 11. TABELA: Desafios diarios
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL,
  challenge_text TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_desafios" ON daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_desafio" ON daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Completar_desafio" ON daily_challenges FOR UPDATE USING (auth.uid() = user_id);

-- 12. TABELA: Lista de compras
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]',
  week_start DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_listas" ON shopping_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_lista" ON shopping_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar_lista" ON shopping_lists FOR UPDATE USING (auth.uid() = user_id);

-- 13. TABELA: Avaliacao inicial
CREATE TABLE IF NOT EXISTS fitness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pushups_result TEXT,
  squat_result TEXT,
  plank_result TEXT,
  overall_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fitness_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_avaliacao" ON fitness_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_avaliacao" ON fitness_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. TABELA: Fotos iniciais
CREATE TABLE IF NOT EXISTS initial_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  front_url TEXT,
  side_url TEXT,
  back_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE initial_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_fotos_init" ON initial_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar_foto_init" ON initial_photos FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 15. TABELA: Configuracoes de acessibilidade
CREATE TABLE IF NOT EXISTS accessibility_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  font_scale NUMERIC DEFAULT 1.0,
  high_contrast BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  captions_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE accessibility_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_configs_acc" ON accessibility_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Salvar_configs_acc" ON accessibility_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Atualizar_configs_acc" ON accessibility_settings FOR UPDATE USING (auth.uid() = user_id);

-- 16. TABELA: Logs da IA
CREATE TABLE IF NOT EXISTS ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_type TEXT,
  prompt_summary TEXT,
  response_summary TEXT,
  response_full JSONB,
  tokens_used INTEGER,
  validation_passed BOOLEAN,
  user_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_logs" ON ai_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_log" ON ai_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 17. TABELA: Eventos de analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver_eventos" ON analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Criar_evento" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- INDEX PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_onboarding_v2_user ON onboarding_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_injury_details_user ON injury_details(user_id, status, date_reported DESC);
CREATE INDEX IF NOT EXISTS idx_injury_checkins_injury ON injury_checkins(injury_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_feedback_user ON exercise_feedback(user_id, exercise_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pre_workout_checkins_user ON pre_workout_checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monthly_reviews_user ON monthly_reviews(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_short_term_goals_user ON short_term_goals(user_id, completed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user ON daily_challenges(user_id, date);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_fitness_assessments_user ON fitness_assessments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user ON ai_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id, event_name, created_at DESC);
