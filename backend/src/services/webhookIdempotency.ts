// src/services/webhookIdempotency.ts
// Serviço de idempotência e dead-letter queue para webhooks - NOVAIX FITNESS

import supabase from '../config/supabase';

async function isEventProcessed(eventId: string): Promise<boolean> {
  if (!eventId) return false;

  const { data } = await supabase
    .from('webhook_events')
    .select('id, status')
    .eq('event_id', eventId)
    .single();

  return data?.status === 'completed';
}

async function markEventProcessing(eventId: string, eventType: string, payload: any): Promise<void> {
  const { error } = await supabase
    .from('webhook_events')
    .upsert({
      event_id: eventId,
      event_type: eventType,
      source: 'asaas',
      payload,
      status: 'processing',
      attempts: 1,
    }, { onConflict: 'event_id' });

  if (error) {
    console.warn('[Idempotency] Erro ao marcar evento como processing:', error.message);
  }
}

async function markEventCompleted(eventId: string): Promise<void> {
  await supabase
    .from('webhook_events')
    .update({ status: 'completed', processed_at: new Date().toISOString() })
    .eq('event_id', eventId);
}

async function markEventFailed(eventId: string, eventType: string, payload: any, error: any): Promise<void> {
  // Atualizar status no webhook_events
  await supabase
    .from('webhook_events')
    .update({ status: 'failed' })
    .eq('event_id', eventId);

  // Inserir na dead-letter queue
  const nextRetryAt = new Date(Date.now() + 5 * 60 * 1000); // 5min
  await supabase
    .from('failed_events')
    .insert({
      event_id: eventId,
      event_type: eventType,
      source: 'asaas',
      payload,
      error_message: error?.message || 'Erro desconhecido',
      error_stack: error?.stack?.substring(0, 1000),
      next_retry_at: nextRetryAt.toISOString(),
    });

  console.error(`[DLQ] Evento ${eventId} (${eventType}) enviado para dead-letter queue.`);
}

async function getFailedEventsForRetry(limit = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from('failed_events')
    .select('*')
    .is('resolved_at', null)
    .lte('next_retry_at', new Date().toISOString())
    .lt('attempts', 5)
    .order('next_retry_at', { ascending: true })
    .limit(limit);

  return (!error && data) ? data : [];
}

async function incrementRetryAttempt(failedEventId: string): Promise<void> {
  const { data: event } = await supabase
    .from('failed_events')
    .select('attempts')
    .eq('id', failedEventId)
    .single();

  const newAttempts = (event?.attempts || 0) + 1;
  const backoffMinutes = Math.pow(2, newAttempts) * 5;
  const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);

  await supabase
    .from('failed_events')
    .update({
      attempts: newAttempts,
      next_retry_at: nextRetry.toISOString(),
    })
    .eq('id', failedEventId);
}

async function resolveFailedEvent(failedEventId: string, resolvedBy: string): Promise<void> {
  await supabase
    .from('failed_events')
    .update({
      resolved_at: new Date().toISOString(),
      resolved_by: resolvedBy,
    })
    .eq('id', failedEventId);
}

export {
  isEventProcessed,
  markEventProcessing,
  markEventCompleted,
  markEventFailed,
  getFailedEventsForRetry,
  incrementRetryAttempt,
  resolveFailedEvent,
};
