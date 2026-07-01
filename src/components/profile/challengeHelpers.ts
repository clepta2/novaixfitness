export function getChallengeProgress(challenge, progress) {
  let current = 0;
  switch (challenge.type) {
    case 'workouts': current = progress.workouts || 0; break;
    case 'minutes': current = progress.minutes || 0; break;
    case 'posts': current = progress.posts || 0; break;
    case 'streak': current = progress.streak || 0; break;
    default: current = 0;
  }
  return Math.min(1, current / challenge.target);
}

export function getChallengeCurrentValue(challenge, progress) {
  switch (challenge.type) {
    case 'workouts': return progress.workouts || 0;
    case 'minutes': return progress.minutes || 0;
    case 'posts': return progress.posts || 0;
    case 'streak': return progress.streak || 0;
    default: return 0;
  }
}

export async function fetchWeeklyProgress(userId, supabase, signal?: AbortSignal) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [workoutsRes, postsRes, claimedRes] = await Promise.all([
    supabase.from('user_workouts').select('completed, duration, completed_at').eq('user_id', userId).eq('completed', true).gte('completed_at', weekStart.toISOString()),
    supabase.from('posts').select('id').eq('user_id', userId).gte('created_at', weekStart.toISOString()),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId).gte('unlocked_at', weekStart.toISOString()),
  ]);

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  const totalWorkouts = workoutsRes.data?.length || 0;
  const totalMinutes = workoutsRes.data?.reduce((s, w) => s + (w.duration || 0), 0) || 0;
  const totalPosts = postsRes.data?.length || 0;
  const streakRes = await supabase.from('profiles').select('streak').eq('id', userId).single();
  const streak = streakRes.data?.streak || 0;

  return {
    progress: { workouts: totalWorkouts, minutes: totalMinutes, posts: totalPosts, streak },
    claimedIds: new Set((claimedRes.data || []).map(a => a.achievement_id)),
  };
}
