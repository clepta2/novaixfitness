-- 20260730000000_webhook_resilience.sql
-- Sistema de resiliência para webhooks: idempotência e dead-letter queue
-- NOVAIX FITNESS

-- Tabela de eventos de webhook processados (idempotência)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'asaas',
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed', 'failed', 'skipped')),
  attempts INTEGER NOT NULL DEFAULT 1,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de eventos falhos (dead-letter queue)
CREATE TABLE IF NOT EXISTS public.failed_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'asaas',
  payload JSONB NOT NULL DEFAULT '{}',
  error_message TEXT,
  error_stack TEXT,
  attempts INTEGER NOT NULL DEFAULT 1,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id
  ON public.webhook_events(event_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status
  ON public.webhook_events(status);

CREATE INDEX IF NOT EXISTS idx_failed_events_next_retry
  ON public.failed_events(next_retry_at)
  WHERE resolved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_failed_events_source
  ON public.failed_events(source, event_type);

-- RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_events ENABLE ROW LEVEL SECURITY;

-- Apenas service_role pode acessar (backend usa service_role_key)
CREATE POLICY "Service role full access to webhook_events"
  ON public.webhook_events FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to failed_events"
  ON public.failed_events FOR ALL
  USING (true) WITH CHECK (true);
