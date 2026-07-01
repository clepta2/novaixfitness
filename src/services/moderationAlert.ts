// src/services/moderationAlert.ts
// Alerta Discord via webhook para a equipe de moderação

const WEBHOOK_URL = process.env.DISCORD_MOD_WEBHOOK;

export async function alertModerationTeam(
  userId: string,
  text: string,
  violations: string[]
): Promise<void> {
  if (!WEBHOOK_URL) return;

  const payload = {
    embeds: [{
      title: '🚨 Violação de Diretrizes Detectada',
      color: 15158332,
      fields: [
        { name: 'ID do Usuário', value: userId, inline: true },
        { name: 'Texto Digitado', value: '```\n' + text.substring(0, 500) + '\n```' },
        { name: 'Vetores Suspeitos', value: violations.join(', ') || 'N/A' },
      ],
      timestamp: new Date().toISOString(),
    }],
  };

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
