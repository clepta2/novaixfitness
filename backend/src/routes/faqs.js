// src/routes/faqs.js
// Rotas de FAQs - NOVAIX FITNESS

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { sanitizeError } = require('../middleware/errorHandler');

// Listar FAQs ativos (publico)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('faqs')
      .select('id, question, answer, category, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Erro ao buscar FAQs:', err);
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Criar FAQ (admin)
router.post('/', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { question, answer, category, sort_order } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Pergunta e resposta obrigatorias' });
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question,
        answer,
        category: category || 'geral',
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Erro ao criar FAQ:', err);
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Atualizar FAQ (admin)
router.put('/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { question, answer, category, sort_order, active } = req.body;

    const { data, error } = await supabase
      .from('faqs')
      .update({ question, answer, category, sort_order, active })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Deletar FAQ (admin)
router.delete('/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'FAQ removido' });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

module.exports = router;
