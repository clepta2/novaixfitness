// src/routes/workouts.js
// Rotas de Treinos

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Listar todos os treinos
router.get('/', async (req, res) => {
  try {
    const { category, level, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('workouts')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buscar treino por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Marcar treino como concluído
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const { rating, notes } = req.body;

    const { data, error } = await supabase
      .from('user_workouts')
      .upsert({
        user_id: req.user.id,
        workout_id: req.params.id,
        completed: true,
        completed_at: new Date(),
        rating,
        notes
      }, { onConflict: 'user_id,workout_id' })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buscar treinos do usuário
router.get('/user/history', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .select('*, workouts(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
