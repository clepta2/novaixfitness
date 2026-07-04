// src/routes/commissions.ts
// Rotas de Comissões e Saques do Coach - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { validateBody, sanitizeString } from '../middleware/validate';
import { sanitizeError } from '../middleware/errorHandler';
import * as asaas from '../services/asaas';

const router: Router = express.Router();
const MIN_WITHDRAWAL = 50;

// [COACH] Consultar saldo e resumo de comissões
router.get('/balance', authenticate, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .rpc('get_coach_balance', { p_coach_id: (req as any).user.id });

    if (error) throw error;
    res.json(data?.[0] || {
      total_earned: 0,
      available_balance: 0,
      pending_amount: 0,
      withdrawn_amount: 0,
      commission_count: 0,
    });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// [COACH] Listar comissões com paginação
router.get('/list', authenticate, async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string, 10) || 20);
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    let query = supabase
      .from('coach_commissions')
      .select('*, profiles!subscriber_id(name, avatar_url)', { count: 'exact' })
      .eq('coach_id', (req as any).user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      commissions: data || [],
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
    });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// [COACH] Listar histórico de saques
router.get('/withdrawals', authenticate, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('coach_withdrawals')
      .select('*')
      .eq('coach_id', (req as any).user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// [COACH] Solicitar saque via Pix
router.post('/withdraw', authenticate, validateBody({
  amount: { required: true, type: 'number', min: MIN_WITHDRAWAL },
  pixKey: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  pixKeyType: { required: true, enum: ['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'EVP'] },
}), async (req: Request, res: Response) => {
  try {
    const { amount, pixKey, pixKeyType } = req.body;

    // 1. Verificar saldo disponível
    const { data: balance } = await supabase
      .rpc('get_coach_balance', { p_coach_id: (req as any).user.id });

    const available = balance?.[0]?.available_balance || 0;
    if (parseFloat(amount) > parseFloat(available)) {
      return res.status(400).json({
        error: `Saldo insuficiente. Disponível: R$ ${parseFloat(available).toFixed(2)}`,
      });
    }

    // 2. Registrar saque como pendente
    const { data: withdrawal, error: wErr } = await supabase
      .from('coach_withdrawals')
      .insert({
        coach_id: (req as any).user.id,
        amount: parseFloat(amount),
        pix_key: sanitizeString(pixKey),
        pix_key_type: pixKeyType,
        status: 'processing',
      })
      .select()
      .single();

    if (wErr) throw wErr;

    // 3. Executar transferência Pix via Asaas
    try {
      const transfer = await asaas.createTransfer({
        value: parseFloat(amount),
        pixAddressKey: sanitizeString(pixKey),
        pixAddressKeyType: pixKeyType,
        description: `NOVAIX - Saque Coach ${(req as any).user.id.substring(0, 8)}`,
      });

      // 4. Atualizar saque como concluído
      await supabase.from('coach_withdrawals').update({
        status: 'completed',
        asaas_transfer_id: transfer.id,
        processed_at: new Date().toISOString(),
      }).eq('id', withdrawal.id);

      // 5. Marcar comissões correspondentes como pagas
      await supabase.from('coach_commissions').update({
        status: 'paid',
      }).eq('coach_id', (req as any).user.id).eq('status', 'available')
        .lte('net_amount', parseFloat(amount));

      res.json({ success: true, withdrawal: { ...withdrawal, status: 'completed' } });
    } catch (transferErr: any) {
      // Marcar saque como falho
      await supabase.from('coach_withdrawals').update({
        status: 'failed',
        failure_reason: transferErr.message,
      }).eq('id', withdrawal.id);

      throw new Error(`Falha na transferência Pix: ${transferErr.message}`);
    }
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// [ADMIN] Listar comissões de todos os coaches
router.get('/admin/all', authenticate, requireRole(['admin', 'superadmin']), async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('coach_commissions')
      .select('*, profiles!coach_id(name, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

export = router;
