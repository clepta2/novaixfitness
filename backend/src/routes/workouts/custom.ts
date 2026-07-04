// src/routes/workouts/custom.ts
// Rotas de Treinos Customizados - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../../config/supabase';
import { authenticate } from '../../middleware/auth';
import { requireSubscription, checkFeature } from '../../middleware/subscription';
import { validateBody, sanitizeString } from '../../middleware/validate';
import { auditWorkout } from '../../middleware/audit';
import { asyncHandler } from '../../middleware/errorHandler';

const router: Router = express.Router();

// Criar treino customizado
router.post('/custom', 
  authenticate, 
  requireSubscription('intermediate'),
  checkFeature('workouts'),
  auditWorkout,
  validateBody({
    name: { required: true, type: 'string', minLength: 3, maxLength: 100 },
    description: { type: 'string', maxLength: 500 },
    category: { required: true, type: 'string' },
    level: { required: true, enum: ['beginner', 'intermediate', 'advanced'] },
    duration: { type: 'number', min: 5, max: 180 },
    exercises: { required: true, type: 'array', minItems: 1, maxItems: 20 }
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, category, level, duration, exercises } = req.body;

    const { count } = await supabase
      .from('custom_workouts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', (req as any).user.id);

    const maxCustom = (req as any).subscription.plan === 'intermediate' ? 5 : 
                      (req as any).subscription.plan === 'premium' ? 15 : 50;

    if (count !== null && count >= maxCustom) {
      return res.status(403).json({ 
        error: 'Limite de treinos customizados atingido',
        limit: true,
        current: count,
        max: maxCustom,
        plan: (req as any).subscription.plan
      });
    }

    const { data, error } = await supabase
      .from('custom_workouts')
      .insert({
        user_id: (req as any).user.id,
        name: sanitizeString(name),
        description: description ? sanitizeString(description) : null,
        category: sanitizeString(category),
        level,
        duration: duration || 45,
        exercises,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      workout: data,
      stats: { totalCustom: (count || 0) + 1, maxCustom }
    });
  })
);

// Listar treinos customizados
router.get('/user/custom', 
  authenticate, 
  requireSubscription('intermediate'),
  asyncHandler(async (req: Request, res: Response) => {
    const { data, error } = await supabase
      .from('custom_workouts')
      .select('*')
      .eq('user_id', (req as any).user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ customWorkouts: data });
  })
);

// Deletar treino customizado
router.delete('/custom/:id', 
  authenticate, 
  requireSubscription('intermediate'),
  auditWorkout,
  asyncHandler(async (req: Request, res: Response) => {
    const id = sanitizeString(req.params.id);

    const { error } = await supabase
      .from('custom_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', (req as any).user.id);

    if (error) throw error;

    res.json({ success: true, message: 'Treino customizado removido' });
  })
);

export = router;
