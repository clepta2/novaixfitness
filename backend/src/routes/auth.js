// src/routes/auth.js
// Rotas de Autenticação

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Cadastro
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) throw error;

    // Criar perfil
    if (data.user) {
      await supabase.rpc('create_profile', {
        user_id: data.user.id,
        user_email: email,
        user_name: name
      });
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Recuperação de senha
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) throw error;

    res.json({ message: 'E-mail de recuperação enviado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
