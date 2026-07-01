import { rateLimit } from './authMiddleware';
import { securityHeaders } from './headersConfig';

export { requireAuth, rateLimit, validateInput, AUTH_REQUIRED_ROUTES } from './authMiddleware';
export { CORS_CONFIG, securityHeaders, isValidUUID, validateUUID } from './headersConfig';
export { encryptSensitiveData, sanitizeResponse, safeQuery } from './dataProtection';

export function auditLog(action: string) {
  return async (req: any, res: any, next: any) => {
    const start = Date.now();
    res.on('finish', async () => {
      try {
        const { supabase } = await import('../config/supabase');
        await supabase.from('audit_log').insert({
          user_id: req.user?.id, action, entity_type: 'api',
          details: { method: req.method, path: req.path, statusCode: res.statusCode, duration: Date.now() - start },
          ip_address: req.ip, user_agent: req.headers['user-agent'],
        });
      } catch (err) {
        if (__DEV__) console.error('Erro ao registrar audit log:', err);
      }
    });
    next();
  };
}

export function securityMiddleware(options: { rateLimit?: any; auditLog?: any } = {}) {
  const middlewares = [securityHeaders];
  if (options.rateLimit) middlewares.push(rateLimit(options.rateLimit));
  if (options.auditLog) middlewares.push(auditLog(options.auditLog));
  return middlewares;
}
