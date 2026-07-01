// src/routes/workouts/history.ts
// Rotas de Histórico de Treinos - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../../config/supabase';
import { authenticate } from '../../middleware/auth';
import { validateQuery } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/errorHandler';

const router: Router = express.Router();

// Histórico de treinos do usuário
router.get('/user/history', 
  authenticate, 
  validateQuery({
    limit: { type: 'number', min: 1, max: 100 },
    offset: { type: 'number', min: 0, max: 1000 },
    completed: { type: 'string', enum: ['true', 'false'] }
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    const { completed } = req.query;

    let query = supabase
      .from('user_workouts')
      .select('*, workouts(name, category, level, duration_minutes, thumbnail_url)', { count: 'exact' })
      .eq('user_id', (req as any).user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (completed === 'true') query = query.eq('completed', true);
    if (completed === 'false') query = query.eq('completed', false);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      history: data,
      total: count,
      limit,
      offset,
      hasMore: count !== null && offset + limit < count
    });
  })
);

export = router;
