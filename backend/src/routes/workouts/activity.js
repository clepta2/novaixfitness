// src/routes/workouts/activity.ts
// Rotas de Atividade de Treinos - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../../config/supabase';
import { authenticate } from '../../middleware/auth';
import { requireSubscription } from '../../middleware/subscription';
import { validateQuery, validateBody, sanitizeString } from '../../middleware/validate';
import { auditWorkout } from '../../middleware/audit';
import { asyncHandler } from '../../middleware/errorHandler';

const router: Router = express.Router();

// Marcar treino como concluído
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
  asyncHandler(async (req: Request, res: Response) => {
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
      .eq('user_id', (req as any).user.id)
      .eq('completed', true);
    const maxWorkouts = (req as any).subscription.config.maxWorkouts;
    if (count !== null && count >= maxWorkouts) {
      return res.status(403).json({ 
        error: 'Limite de treinos do plano atingido',
        limit: true,
        current: count,
        max: maxWorkouts,
        plan: (req as any).subscription.plan,
        upgradeRequired: true
      });
    }
    const { data, error } = await supabase
      .from('user_workouts')
      .upsert({
        user_id: (req as any).user.id,
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
    const earnedPoints = 50 + (rating || 0) * 10;
    await supabase.rpc('increment_user_stats', {
      p_user_id: (req as any).user.id,
      p_workouts: 1,
      p_minutes: duration || 0,
      p_xp: earnedPoints
    });
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('state, city, neighborhood')
        .eq('id', (req as any).user.id)
        .single();
      if (profile && profile.state && profile.city) {
        const periodStart = new Date().toISOString().substring(0, 7) + '-01';
        const { data: existingRanking } = await supabase
          .from('regional_rankings')
          .select('points')
          .eq('user_id', (req as any).user.id)
          .eq('region', profile.state)
          .eq('city', profile.city)
          .eq('neighborhood', profile.neighborhood)
          .eq('period', 'monthly')
          .maybeSingle();
        await supabase
          .from('regional_rankings')
          .upsert({
            user_id: (req as any).user.id,
            region: profile.state,
            city: profile.city,
            neighborhood: profile.neighborhood,
            period: 'monthly',
            period_start: periodStart,
            points: (existingRanking?.points || 0) + earnedPoints
          }, { onConflict: 'user_id,region,city,neighborhood,period' });
      }
    } catch (err: any) {
      console.warn('Erro ao atualizar ranking regional:', err.message);
    }
    res.json({
      success: true,
      workout: data,
      stats: {
        completedToday: (count || 0) + 1,
        maxWorkouts,
        remaining: maxWorkouts - (count || 0) - 1
      }
    });
  })
);

// Estatísticas do usuário
router.get('/user/stats', 
  authenticate, 
  asyncHandler(async (req: Request, res: Response) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_workouts, total_minutes, total_xp, streak, max_streak, subscription_plan')
      .eq('id', (req as any).user.id)
      .single();
    const { count: completedWorkouts } = await supabase
      .from('user_workouts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', (req as any).user.id)
      .eq('completed', true);
    const { count: favoriteCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', (req as any).user.id);
    const { data: recentWorkouts } = await supabase
      .from('user_workouts')
      .select('completed_at, rating')
      .eq('user_id', (req as any).user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);
    const avgRating = recentWorkouts && recentWorkouts.length > 0
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

// Gerar link de compartilhamento
router.post('/:id/share', 
  authenticate, 
  requireSubscription('basic'),
  auditWorkout,
  asyncHandler(async (req: Request, res: Response) => {
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

export = router;