// src/routes/users.js
// Rotas de Usuários

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Buscar perfil do usuário
router.get('/profile', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar perfil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, avatar_url, onboarding } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ name, avatar_url, onboarding, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Salvar onboarding
router.post('/onboarding', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding: req.body, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
