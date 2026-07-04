// src/routes/admin.ts
// Rotas Administrativas - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { requireRole, ROLE_HIERARCHY } from '../middleware/role';
import { validateBody, sanitizeString } from '../middleware/validate';
import { sanitizeError } from '../middleware/errorHandler';

const router: Router = express.Router();

// Criar novo usuário
router.post('/users', authenticate, requireRole(['admin', 'manager', 'employee']), validateBody({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'password' },
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
  role: { enum: ['superadmin', 'admin', 'community_admin', 'workout_admin', 'manager', 'employee', 'creator', 'user'] },
  subscription_plan: { enum: ['free', 'basic', 'intermediate', 'premium', 'ultra'] }
}), async (req: Request, res: Response) => {
  const { email, password, name, role = 'user', subscription_plan = 'free' } = req.body;
  if ((ROLE_HIERARCHY[role] || 0) >= (ROLE_HIERARCHY[(req as any).userRole] || 0)) {
    return res.status(403).json({ error: 'Você não pode criar uma conta com cargo igual ou superior ao seu.' });
  }
  try {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(), password, email_confirm: true, user_metadata: { name: sanitizeString(name), role }
    });
    if (authError || !authUser?.user) throw new Error(authError?.message || 'Falha ao criar credenciais.');
    const { data: profile, error: pErr } = await supabase.from('profiles').update({
      subscription_plan, subscription_status: subscription_plan === 'free' ? 'free' : 'active', updated_at: new Date()
    }).eq('id', authUser.user.id).select().single();
    if (pErr) console.error('Erro ao atualizar novo perfil:', pErr.message);
    res.status(201).json({ message: 'Conta criada com sucesso!', user: { id: authUser.user.id, email, name, role, subscription_plan, profile } });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Modificar dados e permissões de uma conta
router.put('/users/:id', authenticate, requireRole(['admin', 'manager']), validateBody({
  name: { type: 'string', minLength: 2, maxLength: 100 },
  email: { type: 'email' },
  role: { enum: ['superadmin', 'admin', 'community_admin', 'workout_admin', 'manager', 'employee', 'creator', 'user'] },
  subscription_plan: { enum: ['free', 'basic', 'intermediate', 'premium', 'ultra'] },
  subscription_status: { enum: ['free', 'active', 'cancelled', 'past_due', 'overdue', 'inactive'] }
}), async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, email, role, subscription_plan, subscription_status } = req.body;
  try {
    const { data: targetUser, error: getError } = await supabase.from('profiles').select('role').eq('id', id).single();
    if (getError || !targetUser) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const creatorLevel = ROLE_HIERARCHY[(req as any).userRole] || 0;
    if ((ROLE_HIERARCHY[targetUser.role] || 0) >= creatorLevel) {
      return res.status(403).json({ error: 'Você não pode alterar contas com cargo igual ou superior ao seu.' });
    }
    if (role && (ROLE_HIERARCHY[role] || 0) >= creatorLevel) {
      return res.status(403).json({ error: 'Você não pode atribuir um cargo igual ou superior ao seu.' });
    }

    const updates: any = {
      ...(name !== undefined && { name: sanitizeString(name) }),
      ...(email !== undefined && { email: email.toLowerCase() }),
      ...(role !== undefined && { role }),
      ...(subscription_plan !== undefined && { subscription_plan }),
      ...(subscription_status !== undefined && { subscription_status }),
      updated_at: new Date()
    };
    const { data: updatedProfile, error: updateError } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    if (updateError) throw updateError;

    const authUpdates: any = {
      ...(email && { email }),
      ...((name || role) && { user_metadata: { ...(name && { name }), ...(role && { role }) } })
    };
    if (Object.keys(authUpdates).length > 0) await supabase.auth.admin.updateUserById(id, authUpdates);
    res.json({ message: 'Conta atualizada com sucesso!', profile: updatedProfile });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Deletar conta (Somente Administrador Master)
router.delete('/users/:id', authenticate, requireRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.admin.deleteUser(req.params.id as string);
    if (error) throw error;
    res.json({ message: 'Conta excluída com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Obter estatísticas financeiras consolidadas para o admin
router.get('/financial-stats', authenticate, requireRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
  try {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('subscription_status, subscription_plan, created_at');
    if (pErr) throw pErr;

    const PLAN_PRICES: Record<string, number> = { free: 0, basic: 49.9, intermediate: 79.9, premium: 119.9, ultra: 199.9 };
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const active = (profiles || []).filter(p => p.subscription_status === 'active' || p.subscription_status === 'premium');
    const mrr = active.reduce((sum, p) => sum + (PLAN_PRICES[p.subscription_plan || 'free'] || 0), 0);
    const thisMonthNew = (profiles || []).filter(p => p.created_at && p.created_at >= monthStart).length;
    
    const cancelledCount = (profiles || []).filter(p => p.subscription_status === 'cancelled').length;
    const totalSubs = active.length + cancelledCount;
    const churn = totalSubs > 0 ? ((cancelledCount / totalSubs) * 100).toFixed(1) : '0.0';

    const breakdown: Record<string, number> = { free: 0, basic: 0, intermediate: 0, premium: 0, ultra: 0 };
    (profiles || []).forEach(p => {
      const plan = p.subscription_plan || 'free';
      if (breakdown[plan] !== undefined) breakdown[plan]++;
    });

    const { data: recentPayments } = await supabase.from('payments').select('id, amount, status, billing_type, created_at').order('created_at', { ascending: false }).limit(10);
    res.json({ mrr, activeCount: active.length, churnRate: parseFloat(churn), newMonth: thisMonthNew, breakdown, recentPayments: recentPayments || [] });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

export = router;
