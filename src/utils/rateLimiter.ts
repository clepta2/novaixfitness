// src/utils/rateLimiter.ts
// Rate limiter client-side com janela deslizante - NOVAIX FITNESS

type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
};

type Entry = {
  timestamps: number[];
  blockedUntil: number | null;
};

const store = new Map<string, Entry>();

// Limpa entradas antigas periodicamente
function cleanup(key: string) {
  const entry = store.get(key);
  if (!entry) return;
  const now = Date.now();
  entry.timestamps = entry.timestamps.filter(t => now - t < 3600000);
  if (entry.blockedUntil && now > entry.blockedUntil) {
    entry.blockedUntil = null;
    entry.timestamps = [];
  }
}

// Verifica se a acao e permitida
export function isAllowed(key: string, config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  cleanup(key);
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [], blockedUntil: null };
    store.set(key, entry);
  }

  if (entry.blockedUntil && now < entry.blockedUntil) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.blockedUntil - now };
  }

  const windowStart = now - config.windowMs;
  entry.timestamps = entry.timestamps.filter(t => t > windowStart);

  if (entry.timestamps.length >= config.maxAttempts) {
    const blockDuration = config.blockDurationMs || config.windowMs;
    entry.blockedUntil = now + blockDuration;
    return { allowed: false, remaining: 0, retryAfterMs: blockDuration };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: config.maxAttempts - entry.timestamps.length, retryAfterMs: 0 };
}

// Registra uma tentativa (sem verificar - so incrementa o counter)
export function recordAttempt(key: string) {
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [], blockedUntil: null };
    store.set(key, entry);
  }
  entry.timestamps.push(Date.now());
}

// Reseta o contador para uma chave
export function resetLimiter(key: string) {
  store.delete(key);
}

// Reseta tudo
export function resetAllLimiters() {
  store.clear();
}

// Configuracoes pre-definidas por dominio
export const LIMITS = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  forgotPassword: { maxAttempts: 3, windowMs: 15 * 60 * 1000, blockDurationMs: 15 * 60 * 1000 },
  payment: { maxAttempts: 5, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  post: { maxAttempts: 10, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
  comment: { maxAttempts: 20, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
  like: { maxAttempts: 30, windowMs: 60 * 1000 },
  follow: { maxAttempts: 20, windowMs: 60 * 1000 },
  message: { maxAttempts: 30, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
  search: { maxAttempts: 20, windowMs: 60 * 1000 },
  share: { maxAttempts: 10, windowMs: 60 * 1000 },
  challenge: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
  report: { maxAttempts: 5, windowMs: 60 * 60 * 1000 },
  upload: { maxAttempts: 10, windowMs: 60 * 60 * 1000 },
  notification: { maxAttempts: 15, windowMs: 60 * 1000 },
  workoutComplete: { maxAttempts: 10, windowMs: 24 * 60 * 60 * 1000 },
  waterLog: { maxAttempts: 30, windowMs: 24 * 60 * 60 * 1000 },
  mealLog: { maxAttempts: 20, windowMs: 24 * 60 * 60 * 1000 },
} as const;

export type LimitKey = keyof typeof LIMITS;
