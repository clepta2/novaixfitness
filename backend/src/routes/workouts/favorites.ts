// src/routes/workouts/favorites.ts
// Rotas de Treinos Favoritos - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../../config/supabase';
import { authenticate } from '../../middleware/auth';
import { auditWorkout } from '../../middleware/audit';
import { sanitizeString } from '../../middleware/validate';
import { asyncHandler } from '../../middleware/errorHandler';

const router: Router = express.Router();

// Favoritar/desfavoritar treino
router.post('/:id/favorite', 
  authenticate, 
  auditWorkout,
  asyncHandler(async (req: Request, res: Response) => {
    const workoutId = sanitizeString(req.params.id);

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', (req as any).user.id)
      .eq('workout_id', workoutId)
      .single();

    if (existing) {
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      return res.json({ favorited: false });
    }

    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: (req as any).user.id,
        workout_id: workoutId,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    res.json({ favorited: true });
  })
);

// Listar favoritos
router.get('/user/favorites', 
  authenticate, 
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const { data, error, count } = await supabase
      .from('favorites')
      .select('*, workouts(*)', { count: 'exact' })
      .eq('user_id', (req as any).user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      favorites: data,
      total: count,
      limit,
      offset,
      hasMore: count !== null && offset + limit < count
    });
  })
);

export = router;
