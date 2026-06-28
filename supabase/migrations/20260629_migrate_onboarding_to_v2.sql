-- Migrar dados de profiles.onboarding (JSONB) para onboarding_v2 (tabela)
-- Execute no SQL Editor do Supabase

INSERT INTO onboarding_v2 (
  user_id, goal, age_range, gender, weight, height,
  cep, state, city, body_model, level,
  days_per_week, workout_location, gym_type,
  preferred_time, preferred_muscles, current_step,
  created_at, updated_at
)
SELECT
  p.id,
  p.onboarding->>'goal',
  p.onboarding->>'age_range',
  p.onboarding->>'gender',
  (p.onboarding->>'weight')::NUMERIC,
  (p.onboarding->>'height')::NUMERIC,
  p.onboarding->>'cep',
  p.onboarding->>'state',
  p.onboarding->>'city',
  COALESCE(p.onboarding->>'model', p.onboarding->>'body_model'),
  p.onboarding->>'level',
  (p.onboarding->>'daysPerWeek')::INTEGER,
  p.onboarding->>'location',
  p.onboarding->>'gymType',
  p.onboarding->>'preferred_time',
  COALESCE(
    p.onboarding->'preferred_muscles',
    p.onboarding->'preferredMuscles',
    '[]'::JSONB
  ),
  COALESCE(p.onboarding->>'currentStep', 'completed'),
  NOW(),
  NOW()
FROM profiles p
WHERE p.onboarding IS NOT NULL
  AND p.onboarding != '{}'::JSONB
  AND p.onboarding->>'goal' IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM onboarding_v2 ob WHERE ob.user_id = p.id
  );

-- Log da migracao
DO $$
DECLARE
  migrated INTEGER;
BEGIN
  GET DIAGNOSTICS migrated = ROW_COUNT;
  RAISE NOTICE 'Migrados % registros de profiles.onboarding para onboarding_v2', migrated;
END $$;
