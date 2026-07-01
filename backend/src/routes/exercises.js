// src/routes/exercises.js
// Rotas de Exercícios com cache e validação - NOVAIX FITNESS

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/subscription');
const { validateQuery, sanitizeString } = require('../middleware/validate');
const { cacheMiddleware } = require('../middleware/cache');
const { asyncHandler } = require('../middleware/errorHandler');

const MUSCLE_GROUPS = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Abdômen', 'Glúteos', 'Antebraço', 'Panturrilha', 'Lombar'];
const EQUIPMENT_LIST = ['Halteres', 'Barra', 'Máquina', 'Cabo', 'Kettlebell', 'Banco', 'Elástico', 'Peso corporal', 'Barra fixa', 'Nenhum'];
const DIFFICULTY_LEVELS = ['Iniciante', 'Intermediário', 'Avançado'];

/** @swagger /api/exercises: get - Listar exercícios */
router.get('/', cacheMiddleware(300), validateQuery({
  muscle: { type: 'string' }, equipment: { type: 'string' },
  difficulty: { enum: DIFFICULTY_LEVELS }, search: { type: 'string', maxLength: 100 },
  limit: { type: 'number', min: 1, max: 100 }, offset: { type: 'number', min: 0, max: 1000 }
}), asyncHandler(async (req, res) => {
  const { muscle, equipment, difficulty, search, limit = 50, offset = 0 } = req.query;
  let query = supabase.from('exercises').select('*', { count: 'exact' }).range(offset, offset + limit - 1).order('name');
  if (muscle) query = query.eq('muscle_group', sanitizeString(muscle));
  if (equipment) query = query.eq('equipment', sanitizeString(equipment));
  if (difficulty) query = query.eq('difficulty', difficulty);
  if (search) query = query.ilike('name', `%${sanitizeString(search)}%`);
  const { data, error, count } = await query;
  if (error) throw error;
  res.json({ exercises: data, total: count, limit: parseInt(limit), offset: parseInt(offset), hasMore: offset + limit < count });
}));

/** @swagger /api/exercises/muscle/{muscle}: get - Listar por grupo muscular */
router.get('/muscle/:muscle', cacheMiddleware(300), asyncHandler(async (req, res) => {
  const muscle = sanitizeString(req.params.muscle);
  if (!MUSCLE_GROUPS.includes(muscle)) return res.status(400).json({ error: 'Grupo muscular inválido', validGroups: MUSCLE_GROUPS });
  const { data, error } = await supabase.from('exercises').select('*').eq('muscle_group', muscle).order('name');
  if (error) throw error;
  res.json({ exercises: data, muscle });
}));

/** @swagger /api/exercises/equipment/{equipment}: get - Listar por equipamento */
router.get('/equipment/:equipment', cacheMiddleware(300), asyncHandler(async (req, res) => {
  const equipment = sanitizeString(req.params.equipment);
  const { data, error } = await supabase.from('exercises').select('*').eq('equipment', equipment).order('name');
  if (error) throw error;
  res.json({ exercises: data, equipment });
}));

/** @swagger /api/exercises/meta/groups: get - Grupos musculares */
router.get('/meta/groups', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ muscleGroups: MUSCLE_GROUPS }); }));

/** @swagger /api/exercises/meta/equipment: get - Equipamentos */
router.get('/meta/equipment', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ equipment: EQUIPMENT_LIST }); }));

/** @swagger /api/exercises/meta/difficulties: get - Níveis */
router.get('/meta/difficulties', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ difficulties: DIFFICULTY_LEVELS }); }));

/** @swagger /api/exercises/{id}: get - Buscar exercício por ID */
router.get('/:id', cacheMiddleware(600), asyncHandler(async (req, res) => {
  const id = sanitizeString(req.params.id);
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();
  if (error || !data) return res.status(404).json({ error: 'Exercício não encontrado' });
  res.json(data);
}));

/** @swagger /api/exercises/premium/list: get - Listar exercícios premium */
router.get('/premium/list', authenticate, requireSubscription('basic'), cacheMiddleware(120), asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('exercises').select('*').eq('isPremium', true).order('name');
  if (error) throw error;
  res.json({ exercises: data });
}));

/** @swagger /api/exercises/{id}/log: post - Registrar log */
router.post('/:id/log', authenticate, asyncHandler(async (req, res) => {
  const exerciseId = sanitizeString(req.params.id);
  const { sets, reps, weight, notes } = req.body;
  if (!sets || !reps) return res.status(400).json({ error: 'sets e reps são obrigatórios' });
  const { data: exercise } = await supabase.from('exercises').select('id, name').eq('id', exerciseId).single();
  if (!exercise) return res.status(404).json({ error: 'Exercício não encontrado' });
  const { data, error } = await supabase.from('exercise_logs').insert({
    user_id: req.user.id, exercise_id: exerciseId, exercise_name: exercise.name,
    sets: parseInt(sets), reps: parseInt(reps), weight_kg: parseFloat(weight) || 0,
    notes: notes ? sanitizeString(notes) : null, logged_at: new Date().toISOString()
  }).select().single();
  if (error) throw error;
  res.status(201).json({ success: true, log: data });
}));

/** @swagger /api/exercises/{id}/history: get - Histórico de logs */
router.get('/:id/history', authenticate, validateQuery({ limit: { type: 'number', min: 1, max: 100 }, offset: { type: 'number', min: 0, max: 1000 } }), asyncHandler(async (req, res) => {
  const exerciseId = sanitizeString(req.params.id);
  const { limit = 20, offset = 0 } = req.query;
  const { data, error, count } = await supabase.from('exercise_logs').select('*', { count: 'exact' }).eq('user_id', req.user.id).eq('exercise_id', exerciseId).range(offset, offset + limit - 1).order('logged_at', { ascending: false });
  if (error) throw error;
  res.json({ logs: data, total: count, limit: parseInt(limit), offset: parseInt(offset), hasMore: offset + limit < count });
}));

/** @swagger /api/exercises/{id}/stats: get - Estatísticas */
router.get('/:id/stats', authenticate, asyncHandler(async (req, res) => {
  const exerciseId = sanitizeString(req.params.id);
  const { data: logs, error } = await supabase.from('exercise_logs').select('sets, reps, weight_kg, logged_at').eq('user_id', req.user.id).eq('exercise_id', exerciseId).order('logged_at', { ascending: false }).limit(100);
  if (error) throw error;
  if (!logs || logs.length === 0) return res.json({ totalSessions: 0, maxWeight: 0, totalVolume: 0, personalBest: null, lastSession: null });
  const totalSessions = logs.length;
  const maxWeight = Math.max(...logs.map(l => l.weight_kg || 0));
  const totalVolume = logs.reduce((sum, l) => sum + (l.sets * l.reps * (l.weight_kg || 0)), 0);
  const personalBest = logs.reduce((best, l) => {
    const volume = l.sets * l.reps * (l.weight_kg || 0);
    return volume > (best?.volume || 0) ? { ...l, volume } : best;
  }, null);
  res.json({ totalSessions, maxWeight, totalVolume,
    personalBest: personalBest ? { sets: personalBest.sets, reps: personalBest.reps, weight: personalBest.weight_kg, date: personalBest.logged_at } : null,
    lastSession: logs[0] ? { sets: logs[0].sets, reps: logs[0].reps, weight: logs[0].weight_kg, date: logs[0].logged_at } : null
  });
}));

/** @swagger /api/exercises/meta/groups: get - Grupos musculares */
router.get('/meta/groups', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ muscleGroups: MUSCLE_GROUPS }); }));

/** @swagger /api/exercises/meta/equipment: get - Equipamentos */
router.get('/meta/equipment', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ equipment: EQUIPMENT_LIST }); }));

/** @swagger /api/exercises/meta/difficulties: get - Níveis */
router.get('/meta/difficulties', cacheMiddleware(3600), asyncHandler(async (req, res) => { res.json({ difficulties: DIFFICULTY_LEVELS }); }));

module.exports = router;
