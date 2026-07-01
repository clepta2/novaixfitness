// src/security/bruteForce.js
// Protecao contra brute force e credential stuffing

import { supabase } from '../config/supabase';

export async function checkBruteForce(email, ip) {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { count: emailAttempts } = await supabase.from('login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('email', email).eq('is_successful', false).gte('created_at', fiveMinAgo);

  const { count: ipAttempts } = await supabase.from('login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip).eq('is_successful', false).gte('created_at', fiveMinAgo);

  const blocked = (emailAttempts || 0) >= 5 || (ipAttempts || 0) >= 20;

  if (blocked) {
    await supabase.from('security_events').insert({
      event_type: 'brute_force_attempt', severity: 'critical',
      details: { email, ip, emailAttempts, ipAttempts },
    });
    await supabase.from('blocked_ips').upsert({
      ip, reason: 'Brute force attack',
      blocked_until: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }, { onConflict: 'ip' });
  }

  return {
    blocked, emailAttempts: emailAttempts || 0, ipAttempts: ipAttempts || 0,
    emailLimit: 5, ipLimit: 20, retryAfter: blocked ? 300 : 0,
  };
}
