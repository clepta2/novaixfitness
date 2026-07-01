// src/routes/auth.js
// Rotas de Autenticação

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { validateBody, sanitizeString } = require('../middleware/validate');
const { sanitizeError } = require('../middleware/errorHandler');
const { validateCpf } = require('../middleware/validate');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Criar nova conta
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       200:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/signup', validateBody({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'password' },
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 }
}), async (req, res) => {
  try {
    const { email, password, name, cpf, phone } = req.body;
    const sanitizedName = sanitizeString(name);

    if (cpf && !validateCpf(cpf)) {
      return res.status(400).json({ error: 'CPF invalido' });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: { data: { name: sanitizedName, cpf: cpf || null, phone: phone || null } }
    });

    if (error) throw error;

    if (data.user) {
      await supabase.rpc('create_profile', {
        user_id: data.user.id,
        user_email: email.toLowerCase(),
        user_name: sanitizedName
      });
    }

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Credenciais inválidas
 */
router.post('/login', validateBody({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'string' }
}), async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password
    });

    if (error) throw error;

    res.json({ user: data.user, session: data.session });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Enviar email de recuperação de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email enviado
 *       400:
 *         description: Email inválido
 */
router.post('/reset-password', validateBody({
  email: { required: true, type: 'email' }
}), async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase());

    if (error) throw error;

    res.json({ message: 'E-mail de recuperação enviado' });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

module.exports = router;
