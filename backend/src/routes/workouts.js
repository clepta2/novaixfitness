// src/routes/workouts.js
// Rotas de Treinos com Validação de Assinatura - NOVAIX FITNESS

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { requireSubscription, checkFeature, checkLimit } = require('../middleware/subscription');
const { validateQuery, validateBody, sanitizeString } = require('../middleware/validate');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache');
const { auditWorkout } = require('../middleware/audit');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Listar treinos públicos
 *     tags: [Workouts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: level
 *         schema: { type: string, enum: [beginner, intermediate, advanced] }
 *       - in: query
 *         name: isPremium
 *         schema: { type: string, enum: [true, false] }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista de treinos
 */
router.get('/', cacheMiddleware(120), validateQuery({
  category: { type: 'string' },
  level: { enum: ['beginner', 'intermediate', 'advanced'] },
  isPremium: { type: 'string', enum: ['true', 'false'] },
  search: { type: 'string', maxLength: 100 },
  limit: { type: 'number', min: 1, max: 50 },
  offset: { type: 'number', min: 0, max: 1000 }
}), asyncHandler(async (req, res) => {
  const { category, level, isPremium, search, limit = 20, offset = 0 } = req.query;

  let query = supabase
    .from('workouts')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', sanitizeString(category));
  if (level) query = query.eq('level', level);
  if (isPremium === 'true') query = query.eq('is_premium', true);
  if (isPremium === 'false') query = query.eq('is_premium', false);
  if (search) query = query.ilike('name', `%${sanitizeString(search)}%`);

  const { data, error, count } = await query;

  if (error) throw error;

  res.json({
    workouts: data,
    total: count,
    limit: parseInt(limit),
    offset: parseInt(offset),
    hasMore: offset + limit < count
  });
}));

/**
 * @swagger
 * /api/workouts/premium:
 *   get:
 *     summary: Listar treinos premium
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinos premium
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Assinatura necessária
 */
router.get('/premium', 
  authenticate, 
  requireSubscription('basic'), 
  cacheMiddleware(60),
  asyncHandler(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;

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
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < count
    });
  })
);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Buscar treino por ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Treino encontrado
 *       404:
 *         description: Treino não encontrado
 */
router.get('/:id', cacheMiddleware(300), asyncHandler(async (req, res) => {
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

/**
 * @swagger
 * /api/workouts/{id}/complete:
 *   post:
 *     summary: Marcar treino como concluído
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               duration:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Treino concluído
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Limite do plano atingido
 */
router.post('/:id/complete', 
  authenticate, 
  requireSubscription('basic'),
  auditWorkout,
  validateBody({
    rating: { type: 'number', min: 1, max: 5 },
    notes: { type: 'string', maxLength: 500 },
    duration: { type: 'number', min: 1, max: 600 },
    calories: { type: 'number', min: 0, max: 5000 }
  }),
  asyncHandler(async (req, res) => {
    const { rating, notes, duration, calories } = req.body;
    const workoutId = sanitizeString(req.params.id);

    const { data: workout } = await supabase
      .from('workouts')
      .select('id, name, is_premium')
      .eq('id', workoutId)
      .single();

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const { count } = await supabase
      .from('user_workouts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('completed', true);

    const maxWorkouts = req.subscription.config.maxWorkouts;
    if (count >= maxWorkouts) {
      return res.status(403).json({ 
        error: 'Limite de treinos do plano atingido',
        limit: true,
        current: count,
        max: maxWorkouts,
        plan: req.subscription.plan,
        upgradeRequired: true
      });
    }

    const { data, error } = await supabase
      .from('user_workouts')
      .upsert({
        user_id: req.user.id,
        workout_id: workoutId,
        completed: true,
        completed_at: new Date(),
        rating: rating || null,
        notes: notes ? sanitizeString(notes) : null,
        duration_minutes: duration || null,
        calories_burned: calories || null
      }, { onConflict: 'user_id,workout_id' })
      .select()
      .single();

    if (error) throw error;

    await supabase.rpc('increment_user_stats', {
      p_user_id: req.user.id,
      p_workouts: 1,
      p_minutes: duration || 0,
      p_xp: 50 + (rating || 0) * 10
    });

    res.json({
      success: true,
      workout: data,
      stats: {
        completedToday: count + 1,
        maxWorkouts,
        remaining: maxWorkouts - count - 1
      }
    });
  })
);

/**
 * @swagger
 * /api/workouts/user/history:
 *   get:
 *     summary: Histórico de treinos do usuário
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinos concluídos
 */
router.get('/user/history', 
  authenticate, 
  validateQuery({
    limit: { type: 'number', min: 1, max: 100 },
    offset: { type: 'number', min: 0, max: 1000 },
    completed: { type: 'string', enum: ['true', 'false'] }
  }),
  asyncHandler(async (req, res) => {
    const { limit = 20, offset = 0, completed } = req.query;

    let query = supabase
      .from('user_workouts')
      .select('*, workouts(name, category, level, duration_minutes, thumbnail_url)', { count: 'exact' })
      .eq('user_id', req.user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (completed === 'true') query = query.eq('completed', true);
    if (completed === 'false') query = query.eq('completed', false);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      history: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < count
    });
  })
);

/**
 * @swagger
 * /api/workouts/user/stats:
 *   get:
 *     summary: Estatísticas do usuário
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas detalhadas
 */
router.get('/user/stats', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_workouts, total_minutes, total_xp, streak, max_streak, subscription_plan')
      .eq('id', req.user.id)
      .single();

    const { count: completedWorkouts } = await supabase
      .from('user_workouts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('completed', true);

    const { count: favoriteCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const { data: recentWorkouts } = await supabase
      .from('user_workouts')
      .select('completed_at, rating')
      .eq('user_id', req.user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);

    const avgRating = recentWorkouts?.length > 0
      ? recentWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) / recentWorkouts.length
      : 0;

    res.json({
      totalWorkouts: profile?.total_workouts || completedWorkouts || 0,
      totalMinutes: profile?.total_minutes || 0,
      totalXP: profile?.total_xp || 0,
      currentStreak: profile?.streak || 0,
      maxStreak: profile?.max_streak || 0,
      favoriteCount: favoriteCount || 0,
      averageRating: Math.round(avgRating * 10) / 10,
      plan: profile?.subscription_plan || 'free'
    });
  })
);

/**
 * @swagger
 * /api/workouts/{id}/favorite:
 *   post:
 *     summary: Favoritar/desfavoritar treino
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status do favorito
 */
router.post('/:id/favorite', 
  authenticate, 
  auditWorkout,
  asyncHandler(async (req, res) => {
    const workoutId = sanitizeString(req.params.id);

    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
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
        user_id: req.user.id,
        workout_id: workoutId,
        created_at: new Date().toISOString()
      });

    if (error) throw error;

    res.json({ favorited: true });
  })
);

/**
 * @swagger
 * /api/workouts/user/favorites:
 *   get:
 *     summary: Listar favoritos
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */
router.get('/user/favorites', 
  authenticate, 
  asyncHandler(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from('favorites')
      .select('*, workouts(*)', { count: 'exact' })
      .eq('user_id', req.user.id)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      favorites: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
      hasMore: offset + limit < count
    });
  })
);

/**
 * @swagger
 * /api/workouts/user/recommended:
 *   get:
 *     summary: Treinos recomendados
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de recomendações
 */
router.get('/user/recommended', 
  authenticate, 
  requireSubscription('basic'),
  cacheMiddleware(300),
  asyncHandler(async (req, res) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding, subscription_plan')
      .eq('id', req.user.id)
      .single();

    const userLevel = profile?.onboarding?.level || 'intermediate';
    const userGoal = profile?.onboarding?.goal || 'fitness';
    const userLocation = profile?.onboarding?.location || 'gym';

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

    const shuffled = workouts.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 5);

    res.json({
      recommendations: recommended,
      basedOn: {
        level: userLevel,
        goal: userGoal,
        location: userLocation
      }
    });
  })
);

/**
 * @swagger
 * /api/workouts/custom:
 *   post:
 *     summary: Criar treino customizado
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, level, exercises]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               exercises:
 *                 type: array
 *     responses:
 *       201:
 *         description: Treino criado
 *       403:
 *         description: Limite do plano
 */
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
  asyncHandler(async (req, res) => {
    const { name, description, category, level, duration, exercises } = req.body;

    const { count } = await supabase
      .from('custom_workouts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const maxCustom = req.subscription.plan === 'intermediate' ? 5 : 
                      req.subscription.plan === 'premium' ? 15 : 50;

    if (count >= maxCustom) {
      return res.status(403).json({ 
        error: 'Limite de treinos customizados atingido',
        limit: true,
        current: count,
        max: maxCustom,
        plan: req.subscription.plan
      });
    }

    const { data, error } = await supabase
      .from('custom_workouts')
      .insert({
        user_id: req.user.id,
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
      stats: {
        totalCustom: count + 1,
        maxCustom
      }
    });
  })
);

/**
 * @swagger
 * /api/workouts/user/custom:
 *   get:
 *     summary: Listar treinos customizados
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de treinos customizados
 */
router.get('/user/custom', 
  authenticate, 
  requireSubscription('intermediate'),
  asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from('custom_workouts')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ customWorkouts: data });
  })
);

/**
 * @swagger
 * /api/workouts/custom/{id}:
 *   delete:
 *     summary: Deletar treino customizado
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Treino removido
 */
router.delete('/custom/:id', 
  authenticate, 
  requireSubscription('intermediate'),
  auditWorkout,
  asyncHandler(async (req, res) => {
    const id = sanitizeString(req.params.id);

    const { error } = await supabase
      .from('custom_workouts')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'Treino customizado removido' });
  })
);

/**
 * @swagger
 * /api/workouts/{id}/share:
 *   post:
 *     summary: Gerar link de compartilhamento
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Link de compartilhamento
 *       404:
 *         description: Treino não encontrado
 */
router.post('/:id/share', 
  authenticate, 
  requireSubscription('basic'),
  auditWorkout,
  asyncHandler(async (req, res) => {
    const workoutId = sanitizeString(req.params.id);

    const { data: workout } = await supabase
      .from('workouts')
      .select('id, name, category, level')
      .eq('id', workoutId)
      .single();

    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    const shareUrl = `https://novaixfitness.com/workout/${workoutId}`;
    const shareText = `Treinei "${workout.name}" no NOVAIX Fitness! 🏋️`;

    res.json({
      url: shareUrl,
      text: shareText,
      workout: {
        id: workout.id,
        name: workout.name,
        category: workout.category,
        level: workout.level
      }
    });
  })
);

/**
 * @swagger
 * /api/workouts/meta/categories:
 *   get:
 *     summary: Categorias de treinos
 *     tags: [Workouts]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/meta/categories', cacheMiddleware(3600), asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('category')
    .order('category');

  if (error) throw error;

  const categories = [...new Set(data.map(w => w.category))];

  res.json({ categories });
}));

/**
 * @swagger
 * /api/workouts/meta/levels:
 *   get:
 *     summary: Níveis de treinos
 *     tags: [Workouts]
 *     responses:
 *       200:
 *         description: Lista de níveis
 */
router.get('/meta/levels', cacheMiddleware(3600), asyncHandler(async (req, res) => {
  res.json({
    levels: [
      { id: 'beginner', label: 'Iniciante', description: 'Para quem está começando' },
      { id: 'intermediate', label: 'Intermediário', description: 'Para quem já treina' },
      { id: 'advanced', label: 'Avançado', description: 'Para atletas experientes' }
    ]
  });
}));

module.exports = router;
