// src/routes/users.ts
// Rotas de Usuários

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { validateBody, sanitizeString, sanitizeObject } from '../middleware/validate';
import { sanitizeError } from '../middleware/errorHandler';

const router: Router = express.Router();

// Buscar perfil do usuário
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (req as any).user.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Atualizar perfil
router.put('/profile', authenticate, validateBody({
  name: { type: 'string', minLength: 2, maxLength: 100 },
  avatar_url: { type: 'string', maxLength: 500 }
}), async (req: Request, res: Response) => {
  try {
    const { name, avatar_url, onboarding } = req.body;
    
    const updateData: any = { updated_at: new Date() };
    if (name !== undefined) updateData.name = sanitizeString(name);
    if (avatar_url !== undefined) updateData.avatar_url = sanitizeString(avatar_url);
    if (onboarding !== undefined) updateData.onboarding = sanitizeObject(onboarding);

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', (req as any).user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Salvar onboarding
router.post('/onboarding', authenticate, async (req: Request, res: Response) => {
  try {
    const onboardingData = sanitizeObject(req.body);
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding: onboardingData, updated_at: new Date() })
      .eq('id', (req as any).user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

export = router;
