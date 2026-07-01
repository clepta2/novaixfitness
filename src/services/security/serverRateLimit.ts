// src/services/security/serverRateLimit.ts
// Rate limiting SERVER-SIDE — complementa o client-side
// Baseado na REGRA 5: Rate Limiting server-side obrigatorio

import { supabase } from '../../config/supabase';

type RateLimitConfig = {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
  reason?: string;
};

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  register: { maxRequests: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  payment: { maxRequests: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  webhook: { maxRequests: 100, windowMs: 60 * 1000 },
  api: { maxRequests: 100, windowMs: 60 * 1000 },
  password_reset: { maxRequests: 3, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  search: { maxRequests: 30, windowMs: 60 * 1000 },
  upload: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
};

// Verifica rate limit no Supabase (persistente, sobrevive a restarts)
export async function checkServerRateLimit(
  action: string,
  identifier: string,
  config?: Partial<RateLimitConfig>
): Promise<RateLimitResult> {
  const cfg = { ...DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS.api, ...config };
  const windowStart = new Date(Date.now() - cfg.windowMs).toISOString();

  try {
    // Busca contagem de chamadas na janela atual
    const { data: existing } = await supabase
      .from('rate_limit_events')
      .select('id')
      .eq('action', action)
      .eq('identifier', identifier)
      .gte('created_at', windowStart);

    const count = existing?.length || 0;

    if (count >= cfg.maxRequests) {
      const retryAfterMs = cfg.blockDurationMs || cfg.windowMs;

      // Log da violacao
      await supabase.from('rate_limit_events').insert({
        action,
        identifier,
        event_type: 'blocked',
        created_at: new Date().toISOString(),
      });

      return {
        allowed: false,
        remaining: 0,
        retryAfterMs,
        reason: `Limite de ${cfg.maxRequests} chamadas por ${cfg.windowMs / 1000}s excedido`,
      };
    }

    // Registra a chamada
    await supabase.from('rate_limit_events').insert({
      action,
      identifier,
      event_type: 'allowed',
      created_at: new Date().toISOString(),
    });

    return {
      allowed: true,
      remaining: cfg.maxRequests - count - 1,
      retryAfterMs: 0,
    };
  } catch {
    // Em caso de erro no banco, permite (fail-open para disponibilidade)
    return { allowed: true, remaining: cfg.maxRequests, retryAfterMs: 0 };
  }
}

// Express middleware wrapper
export function rateLimitMiddleware(action: string, identifierFn?: (req: any) => string) {
  return async (req: any, res: any, next: any) => {
    const identifier = identifierFn ? identifierFn(req) : (req.ip || req.connection?.remoteAddress || 'unknown');
    const result = await checkServerRateLimit(action, identifier);

    res.set('X-RateLimit-Remaining', String(result.remaining));
    res.set('X-RateLimit-Action', action);

    if (!result.allowed) {
      res.set('Retry-After', String(Math.ceil(result.retryAfterMs / 1000)));
      return res.status(429).json({
        error: 'Muitas requisicoes',
        retryAfterMs: result.retryAfterMs,
        action,
      });
    }

    next();
  };
}

// Limpa registros antigos (manutencao)
export async function cleanupOldRateLimits(olderThanDays: number = 7): Promise<number> {
  try {
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('rate_limit_events')
      .delete()
      .lt('created_at', cutoff)
      .select('id');
    return data?.length || 0;
  } catch {
    return 0;
  }
}
