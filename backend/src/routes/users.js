// src/routes/users.js
// Rotas de Usuários

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { validateBody, sanitizeString, sanitizeObject } = require('../middleware/validate');

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
router.put('/profile', authenticate, validateBody({
  name: { type: 'string', minLength: 2, maxLength: 100 },
  avatar_url: { type: 'string', maxLength: 500 }
}), async (req, res) => {
  try {
    const { name, avatar_url, onboarding } = req.body;
    
    const updateData = { updated_at: new Date() };
    if (name !== undefined) updateData.name = sanitizeString(name);
    if (avatar_url !== undefined) updateData.avatar_url = sanitizeString(avatar_url);
    if (onboarding !== undefined) updateData.onboarding = sanitizeObject(onboarding);

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
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
    const onboardingData = sanitizeObject(req.body);
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ onboarding: onboardingData, updated_at: new Date() })
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
