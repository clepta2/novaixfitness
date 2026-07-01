// src/middleware/role.ts
// Middleware de Autorização por Cargo (RBAC) - NOVAIX FITNESS

import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabase';

interface CacheEntry {
  role: string;
  timestamp: number;
}

// Cache de roles em memória com TTL de 5 minutos
const roleCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

// Hierarquia de cargos (maior número = mais permissões)
const ROLE_HIERARCHY: Record<string, number> = {
  user: 0,
  creator: 1,
  workout_admin: 2,
  community_admin: 2,
  employee: 2,
  manager: 3,
  admin: 4,
  superadmin: 5,
};

function getCachedRole(userId: string): string | null {
  const entry = roleCache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    roleCache.delete(userId);
    return null;
  }
  return entry.role;
}

function setCachedRole(userId: string, role: string): void {
  roleCache.set(userId, { role, timestamp: Date.now() });
}

function clearRoleCache(userId?: string): void {
  if (userId) roleCache.delete(userId);
  else roleCache.clear();
}

async function resolveUserRole(userId: string): Promise<string> {
  const cached = getCachedRole(userId);
  if (cached) return cached;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const role = (!error && profile?.role) ? profile.role : 'user';
    setCachedRole(userId, role);
    return role;
  } catch {
    return 'user';
  }
}

function isRoleAllowed(userRole: string, allowedRoles: string[]): boolean {
  // Verificação direta
  if (allowedRoles.includes(userRole)) return true;

  // Verificação hierárquica: superadmin herda tudo
  if (userRole === 'superadmin') return true;

  // Admin herda roles de manager, employee e admin
  if (userRole === 'admin') {
    return allowedRoles.some(r =>
      ['admin', 'manager', 'employee', 'workout_admin', 'community_admin'].includes(r)
    );
  }

  // Manager herda roles de employee
  if (userRole === 'manager') {
    return allowedRoles.some(r => ['manager', 'employee'].includes(r));
  }

  return false;
}

const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
      const userRole = await resolveUserRole((req as any).user.id);

      if (!isRoleAllowed(userRole, allowedRoles)) {
        return res.status(403).json({
          error: 'Acesso negado. Privilégios insuficientes.',
          requiredRoles: allowedRoles,
          currentRole: userRole,
        });
      }

      (req as any).userRole = userRole;
      (req as any).roleLevel = ROLE_HIERARCHY[userRole] || 0;
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
};

const requireMinLevel = (minLevel: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
      const userRole = await resolveUserRole((req as any).user.id);
      const level = ROLE_HIERARCHY[userRole] || 0;

      if (level < minLevel) {
        return res.status(403).json({
          error: 'Nível de acesso insuficiente.',
          currentLevel: level,
          requiredLevel: minLevel,
        });
      }

      (req as any).userRole = userRole;
      (req as any).roleLevel = level;
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao verificar nível de acesso' });
    }
  };
};

export {
  requireRole,
  requireMinLevel,
  resolveUserRole,
  clearRoleCache,
  isRoleAllowed,
  ROLE_HIERARCHY,
};
