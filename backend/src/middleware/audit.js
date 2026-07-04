// src/middleware/audit.ts
// Middleware de auditoria para operações importantes - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

const logAudit = async (userId: string, action: string, details: any = {}): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      details,
      ip_address: details.ip || 'unknown',
      user_agent: details.userAgent || 'unknown',
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Erro ao registrar auditoria:', err.message);
  }
};

const audit = (action: string) => (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(body: any) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      const userId = (req as any).user?.id || 'anonymous';
      logAudit(userId, action, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        ip: req.ip || (req.socket?.remoteAddress),
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? req.body : undefined,
      });
    }
    return originalSend.call(this, body);
  };
  
  next();
};

const auditAuth = audit('auth_action');
const auditProfile = audit('profile_update');
const auditPayment = audit('payment_action');
const auditWorkout = audit('workout_action');
const auditAdmin = audit('admin_action');
const auditDataExport = audit('data_export');
const auditDataDeletion = audit('data_deletion');

export {
  logAudit,
  audit,
  auditAuth,
  auditProfile,
  auditPayment,
  auditWorkout,
  auditAdmin,
  auditDataExport,
  auditDataDeletion,
};
