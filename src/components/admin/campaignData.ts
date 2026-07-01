export const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'Todos', icon: 'people' },
  { value: 'premium', label: 'Premium', icon: 'star' },
  { value: 'free', label: 'Free', icon: 'person' },
  { value: 'marketing', label: 'Marketing', icon: 'mail' },
];

export const QUICK_MESSAGES = [
  { title: 'Novo treino!', body: 'Confira o novo treino disponível na app!' },
  { title: 'Motivação', body: 'Não desista! Cada treino te aproxima do seu objetivo.' },
  { title: 'Streak em risco', body: 'Você está a um treino de manter sua sequência!' },
  { title: 'Promoção', body: 'Aproveite 30% OFF em qualquer plano premium.' },
];

export async function sendPushCampaign({ audience, title, body }) {
  const { supabase } = require('../../config/supabase');

  let query = supabase.from('profiles').select('push_token').not('push_token', 'is', null);
  if (audience === 'marketing') query = query.eq('consent_marketing', true);
  else if (audience === 'premium') query = query.eq('subscription_status', 'premium');
  else if (audience === 'free') query = query.in('subscription_status', ['inactive', 'free', null]);

  const { data: profiles } = await query;
  const tokens = (profiles || []).map(p => p.push_token).filter(Boolean);

  if (tokens.length === 0) {
    return { sent: 0, success: false, error: 'Nenhum usuário encontrado' };
  }

  const messages = tokens.map(token => ({
    to: token, sound: 'default', title, body, data: { type: 'campaign' },
  }));

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });

  await response.json();
  return { sent: tokens.length, success: true };
}
