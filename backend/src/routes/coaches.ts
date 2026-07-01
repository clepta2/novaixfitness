// src/routes/coaches.ts
// Rotas de Validação/KYC de Coaches - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { validateBody, sanitizeString } from '../middleware/validate';
import { asyncHandler } from '../middleware/errorHandler';

const router: Router = express.Router();

// Enviar solicitação de registro de Coach
router.post('/register', 
  authenticate,
  validateBody({
    display_name: { required: true, type: 'string', minLength: 3, maxLength: 100 },
    bio: { type: 'string', maxLength: 500 },
    category: { type: 'string', maxLength: 50 },
    cref: { required: true, type: 'string', minLength: 4, maxLength: 20 },
    document_url: { required: true, type: 'string', minLength: 10, maxLength: 500 }
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { display_name, bio, category, cref, document_url } = req.body;

    const cleanName = sanitizeString(display_name);
    const cleanBio = bio ? sanitizeString(bio) : '';
    const cleanCategory = category ? sanitizeString(category) : 'fitness';
    const cleanCref = sanitizeString(cref);
    const cleanDocUrl = sanitizeString(document_url);

    // Upsert em creator_profiles definindo status como pending e is_verified como false
    const { error: upsertError } = await supabase
      .from('creator_profiles')
      .upsert({
        user_id: userId,
        display_name: cleanName,
        bio: cleanBio,
        category: cleanCategory,
        cref: cleanCref,
        document_url: cleanDocUrl,
        is_verified: false,
        status: 'pending',
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (upsertError) throw upsertError;

    // Atualizar role do profile principal para 'creator'
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'creator', updated_at: new Date() })
      .eq('id', userId);

    if (profileError) throw profileError;

    res.status(201).json({
      success: true,
      status: 'pending',
      message: 'Cadastro de Coach enviado para análise do administrador'
    });
  })
);

// Consultar status do perfil de Coach do usuário logado
router.get('/status',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('*')
      .eq('user_id', (req as any).user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.json({ registered: false, status: null });

    res.json({ registered: true, profile: data });
  })
);

// [ADMIN] Listar solicitações pendentes de Coaches
router.get('/admin/pending',
  authenticate,
  requireRole(['admin', 'manager']),
  asyncHandler(async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from('creator_profiles')
      .select('*, profiles(name, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  })
);

// [ADMIN] Aprovar solicitação de Coach
router.post('/admin/approve/:id',
  authenticate,
  requireRole(['admin', 'manager']),
  asyncHandler(async (req: Request, res: Response) => {
    const coachId = sanitizeString(req.params.id);

    const { error: creatorError } = await supabase
      .from('creator_profiles')
      .update({
        status: 'active',
        is_verified: true
      })
      .eq('user_id', coachId);

    if (creatorError) throw creatorError;

    res.json({ success: true, message: 'Coach aprovado com sucesso' });
  })
);

// [ADMIN] Rejeitar/Suspender Coach
router.post('/admin/reject/:id',
  authenticate,
  requireRole(['admin', 'manager']),
  asyncHandler(async (req: Request, res: Response) => {
    const coachId = sanitizeString(req.params.id);

    const { error: creatorError } = await supabase
      .from('creator_profiles')
      .update({
        status: 'suspended',
        is_verified: false
      })
      .eq('user_id', coachId);

    if (creatorError) throw creatorError;

    // Opcional: Reverter cargo no profiles para 'user'
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'user', updated_at: new Date() })
      .eq('id', coachId);

    if (profileError) throw profileError;

    res.json({ success: true, message: 'Coach rejeitado/suspenso' });
  })
);

export = router;
