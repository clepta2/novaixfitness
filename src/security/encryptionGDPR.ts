// src/security/encryptionGDPR.ts
// LGPD/GDPR compliance

export async function exportUserData(userId: string) {
  const { supabase } = await import('../config/supabase');
  const [profile, workouts, posts, messages] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('user_workouts').select('*').eq('user_id', userId),
    supabase.from('posts').select('*').eq('user_id', userId),
    supabase.from('messages').select('*').eq('user_id', userId),
  ]);
  return { exportedAt: new Date().toISOString(), userId, data: { profile: profile.data, workouts: workouts.data, posts: posts.data, messages: messages.data } };
}

export async function deleteUserData(userId: string, options: { permanent?: boolean; keepAnonymized?: boolean } = {}) {
  const { supabase } = await import('../config/supabase');
  const { permanent = false } = options;
  if (permanent) {
    await Promise.all([
      supabase.from('posts').delete().eq('user_id', userId),
      supabase.from('messages').delete().eq('user_id', userId),
      supabase.from('user_workouts').delete().eq('user_id', userId),
      supabase.from('profiles').delete().eq('id', userId),
    ]);
  } else {
    await supabase.from('profiles').update({
      name: 'Usuario Excluido', email: null, phone: null, avatar_url: null,
      deleted_at: new Date().toISOString(), is_anonymized: true,
    }).eq('id', userId);
  }
  return { deleted: true, permanent };
}

export async function getDataRetentionReport() {
  const { supabase } = await import('../config/supabase');
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2);
  const { data: oldData } = await supabase.from('audit_log').select('id', { count: 'exact', head: true }).lt('created_at', cutoffDate.toISOString());
  return { cutoffDate: cutoffDate.toISOString(), oldRecordsCount: oldData || 0, recommendation: 'Dados com mais de 2 anos devem ser revisados ou excluidos' };
}
