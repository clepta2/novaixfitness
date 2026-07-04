// src/routes/workouts/listing.ts
// Rotas de Listagem de Treinos - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../../config/supabase';
import { authenticate } from '../../middleware/auth';
import { requireSubscription } from '../../middleware/subscription';
import { validateQuery, sanitizeString } from '../../middleware/validate';
import { cacheMiddleware } from '../../middleware/cache';
import { asyncHandler } from '../../middleware/errorHandler';

const router: Router = express.Router();

// Listar treinos públicos
router.get('/', cacheMiddleware(120), validateQuery({
  category: { type: 'string' },
  level: { enum: ['beginner', 'intermediate', 'advanced'] },
  isPremium: { type: 'string', enum: ['true', 'false'] },
  search: { type: 'string', maxLength: 100 },
  limit: { type: 'number', min: 1, max: 50 },
  offset: { type: 'number', min: 0, max: 1000 }
}), asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '20', 10);
  const offset = parseInt(req.query.offset as string || '0', 10);
  const { category, level, isPremium, search } = req.query;

  let query = supabase
    .from('workouts')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', sanitizeString(category as string));
  if (level) query = query.eq('level', level as string);
  if (isPremium === 'true') query = query.eq('is_premium', true);
  if (isPremium === 'false') query = query.eq('is_premium', false);
  if (search) query = query.ilike('name', `%${sanitizeString(search as string)}%`);

  const { data, error, count } = await query;
  if (error) throw error;

  res.json({
    workouts: data,
    total: count,
    limit,
    offset,
    hasMore: count !== null && offset + limit < count
  });
}));

// Listar treinos premium
router.get('/premium', 
  authenticate, 
  requireSubscription('basic'), 
  cacheMiddleware(60),
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const { data, error, count } = await supabase
      .from('workouts')
      .select('*', { count: 'exact' })
      .eq('is_premium', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      workouts: data,
      total: count,
      limit,
      offset,
      hasMore: count !== null && offset + limit < count
    });
  })
);

// Treinos recomendados
router.get('/user/recommended', 
  authenticate, 
  requireSubscription('basic'),
  cacheMiddleware(300),
  asyncHandler(async (req: Request, res: Response) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding, subscription_plan')
      .eq('id', (req as any).user.id)
      .single();

    const userLevel = (profile?.onboarding as any)?.level || 'intermediate';
    const userGoal = (profile?.onboarding as any)?.goal || 'fitness';
    const userLocation = (profile?.onboarding as any)?.location || 'gym';

    let query = supabase
      .from('workouts')
      .select('*')
      .eq('level', userLevel)
      .limit(10);

    if (userLocation === 'home') {
      query = query.eq('category', 'Calistenia');
    }

    const { data: workouts, error } = await query;
    if (error) throw error;

    const shuffled = (workouts || []).sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 5);

    res.json({
      recommendations: recommended,
      basedOn: { level: userLevel, goal: userGoal, location: userLocation }
    });
  })
);

// Buscar treino por ID
router.get('/:id', cacheMiddleware(300), asyncHandler(async (req: Request, res: Response) => {
  const id = sanitizeString(req.params.id);

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Treino não encontrado' });
  }

  if (data.is_premium) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_plan')
          .eq('id', user.id)
          .single();

        const hasAccess = profile?.subscription_status === 'active' && 
          ['basic', 'intermediate', 'premium', 'ultra'].includes(profile?.subscription_plan);
        
        if (!hasAccess) {
          return res.status(403).json({ 
            error: 'Este treino requer assinatura',
            required: true,
            workout: { id: data.id, name: data.name, isPremium: true }
          });
        }
      }
    }
  }

  res.json(data);
}));

// Categorias de treinos
router.get('/meta/categories', cacheMiddleware(3600), asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('category')
    .order('category');

  if (error) throw error;

  const categories = [...new Set((data || []).map(w => w.category))];
  res.json({ categories });
}));

// Níveis de treinos
router.get('/meta/levels', cacheMiddleware(3600), asyncHandler(async (req: Request, res: Response) => {
  res.json({
    levels: [
      { id: 'beginner', label: 'Iniciante', description: 'Para quem está começando' },
      { id: 'intermediate', label: 'Intermediário', description: 'Para quem já treina' },
      { id: 'advanced', label: 'Avançado', description: 'Para atletas experientes' }
    ]
  });
}));

export = router;
