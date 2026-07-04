-- Atomic profile field increments — prevents lost updates from concurrent XP/counter writes
-- Run in Supabase SQL Editor or via `supabase db push`

-- Increment by arbitrary amount (replaces read-modify-write pattern)
CREATE OR REPLACE FUNCTION increment_profile_field(p_user_id uuid, p_field text, p_amount integer)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE profiles SET %I = COALESCE(%I, 0) + $1 WHERE id = $2', p_field, p_field)
  USING p_amount, p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment total_xp specifically (most common path)
CREATE OR REPLACE FUNCTION increment_xp(p_user_id uuid, p_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET total_xp = COALESCE(total_xp, 0) + p_amount WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment multiple profile fields atomically in a single row lock
CREATE OR REPLACE FUNCTION increment_profile_stats(
  p_user_id uuid,
  p_workouts integer DEFAULT 0,
  p_minutes integer DEFAULT 0,
  p_xp integer DEFAULT 0
)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    total_xp = COALESCE(total_xp, 0) + p_xp,
    total_workouts = COALESCE(total_workouts, 0) + p_workouts,
    total_minutes = COALESCE(total_minutes, 0) + p_minutes
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION increment_profile_field(uuid, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_xp(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_profile_stats(uuid, integer, integer, integer) TO authenticated;
