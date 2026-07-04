// src/services/retentionService.ts
// Serviço de notificações de retenção, cobrança e streaks - NOVAIX FITNESS

import supabase from '../config/supabase';

const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

async function sendPush(pushToken: string, title: string, body: string, type: string): Promise<any> {
  try {
    const response = await fetch(EXPO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data: { type },
      }),
    });
    return await response.json();
  } catch (err: any) {
    console.error(`[Push Error] Falha ao enviar para ${pushToken}:`, err.message);
    return null;
  }
}

async function runRetentionChecks(): Promise<{ inactiveSent: number; overdueSent: number; streakSent: number }> {
  const stats = { inactiveSent: 0, overdueSent: 0, streakSent: 0 };

  // 1. Inatividade (3-4 dias)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date();
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  const { data: inactiveUsers } = await supabase
    .from('profiles')
    .select('id, name, push_token')
    .not('push_token', 'is', null)
    .lte('updated_at', threeDaysAgo.toISOString())
    .gte('updated_at', fourDaysAgo.toISOString());

  if (inactiveUsers && inactiveUsers.length > 0) {
    for (const user of inactiveUsers) {
      if (user.push_token) {
        await sendPush(
          user.push_token,
          `Sentimos sua falta, ${user.name}! 🏋️‍♂️`,
          'Que tal manter o foco hoje? Seus treinos diários estão esperando por você no Nix.',
          'reminder'
        );
        stats.inactiveSent++;
      }
    }
  }

  // 2. Assinaturas Past due/Vencida
  const { data: overdueUsers } = await supabase
    .from('profiles')
    .select('id, name, push_token')
    .not('push_token', 'is', null)
    .in('subscription_status', ['overdue', 'past_due']);

  if (overdueUsers && overdueUsers.length > 0) {
    for (const user of overdueUsers) {
      if (user.push_token) {
        await sendPush(
          user.push_token,
          'Problema no pagamento da assinatura 💳',
          'Olá! Notamos um problema no processamento da sua mensalidade. Acesse a aba Assinatura para atualizar.',
          'system'
        );
        stats.overdueSent++;
      }
    }
  }

  // 3. Streak milestones (7, 15, 30 dias)
  const { data: streakUsers } = await supabase
    .from('profiles')
    .select('id, name, push_token, streak')
    .not('push_token', 'is', null)
    .in('streak', [7, 15, 30]);

  if (streakUsers && streakUsers.length > 0) {
    for (const user of streakUsers) {
      if (user.push_token) {
        await sendPush(
          user.push_token,
          `Sequência Incrível! 🔥🏆`,
          `Parabéns, ${user.name}! Você completou uma sequência de ${user.streak} dias de treinos seguidos! Continue assim.`,
          'achievement'
        );
        stats.streakSent++;
      }
    }
  }

  return stats;
}

export {
  sendPush,
  runRetentionChecks,
};
