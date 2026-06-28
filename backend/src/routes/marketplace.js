// src/routes/marketplace.js
// Rotas do marketplace - NOVAIX FITNESS

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { sanitizeError } = require('../middleware/errorHandler');

// Listar produtos (publico)
router.get('/products', async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, limit = 20, offset = 0, featured } = req.query;

    let query = supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category) query = query.eq('marketplace_categories.slug', category);
    if (brand) query = query.ilike('brand', `%${brand}%`);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
    if (minPrice) query = query.gte('price', Number(minPrice));
    if (maxPrice) query = query.lte('price', Number(maxPrice));
    if (featured === 'true') query = query.eq('is_featured', true);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Detalhe do produto (publico)
router.get('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Produto nao encontrado' });
  }
});

// Categorias (publico)
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase.from('marketplace_categories').select('*').order('sort_order');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Produtos em destaque (publico)
router.get('/featured', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 6, 20);
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// ===== ADMIN =====

// Criar produto (admin)
router.post('/admin/products', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { category_id, name, description, price, original_price, brand, image_url, affiliate_url, stock_type, tags, is_featured } = req.body;
    if (!name || !category_id) return res.status(400).json({ error: 'Nome e categoria obrigatorios' });

    const { data, error } = await supabase
      .from('marketplace_products')
      .insert({ category_id, name, description, price, original_price, brand, image_url, affiliate_url, stock_type: stock_type || 'physical', tags: tags || [], is_featured: is_featured || false })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Editar produto (admin)
router.put('/admin/products/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const updates = {};
    const fields = ['category_id', 'name', 'description', 'price', 'original_price', 'brand', 'image_url', 'affiliate_url', 'stock_type', 'tags', 'is_featured', 'is_active'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    updates.updated_at = new Date();

    const { data, error } = await supabase
      .from('marketplace_products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Deletar produto (admin)
router.delete('/admin/products/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { error } = await supabase.from('marketplace_products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Produto removido' });
  } catch (err) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

module.exports = router;
