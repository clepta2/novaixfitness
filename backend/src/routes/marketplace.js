// src/routes/marketplace.ts
// Rotas do marketplace - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { sanitizeError } from '../middleware/errorHandler';
import { contentCreationLimiter } from '../middleware/rateLimiter';

const router: Router = express.Router();
const MAX_LIMIT = 50;

function sanitizeSearch(str: any): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[%_]/g, '').trim().slice(0, 100);
}

function validateProductInput(body: any, isUpdate: boolean = false): string[] {
  const errors: string[] = [];
  if (!isUpdate) {
    if (!body.name || body.name.length < 2) errors.push('Nome deve ter pelo menos 2 caracteres');
    if (!body.category_id) errors.push('Categoria e obrigatoria');
  }
  if (body.price !== undefined && body.price !== null && Number(body.price) < 0) errors.push('Preco nao pode ser negativo');
  if (body.name && body.name.length > 200) errors.push('Nome muito longo (max 200)');
  if (body.description && body.description.length > 2000) errors.push('Descricao muito longa (max 2000)');
  if (body.affiliate_url && !body.affiliate_url.match(/^https?:\/\//)) errors.push('URL do afiliado deve comecar com http:// ou https://');
  if (body.stock_type && !['physical', 'digital', 'coupon'].includes(body.stock_type)) errors.push('Tipo de estoque invalido');
  return errors;
}

// Listar produtos (publico)
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, brand, search, minPrice, maxPrice, limit = '20', offset = '0', featured } = req.query;
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), MAX_LIMIT);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    let query = supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1);

    if (category) query = query.eq('marketplace_categories.slug', sanitizeSearch(category));
    if (brand) query = query.ilike('brand', `%${sanitizeSearch(brand)}%`);
    if (search) {
      const q = sanitizeSearch(search);
      if (q) query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%`);
    }
    if (minPrice) query = query.gte('price', Math.max(Number(minPrice) || 0, 0));
    if (maxPrice) query = query.lte('price', Math.min(Number(maxPrice) || 99999, 99999));
    if (featured === 'true') query = query.eq('is_featured', true);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Detalhe do produto (publico)
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(404).json({ error: 'Produto nao encontrado' });
  }
});

// Categorias (publico)
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('marketplace_categories').select('*').order('sort_order');
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Produtos em destaque (publico)
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 20);
    const { data, error } = await supabase
      .from('marketplace_products')
      .select('*, marketplace_categories(name, slug, icon, color)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// ===== ADMIN =====

// Criar produto (admin)
router.post('/admin/products', authenticate, requireRole(['admin']), contentCreationLimiter, async (req: Request, res: Response) => {
  try {
    const errors = validateProductInput(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join('. ') });

    const { category_id, name, description, price, original_price, brand, image_url, images, affiliate_url, stock_type, tags, is_featured } = req.body;

    const { data, error } = await supabase
      .from('marketplace_products')
      .insert({
        category_id, name: name.trim(), description: description?.trim() || null,
        price: price ? Number(price) : null, original_price: original_price ? Number(original_price) : null,
        brand: brand?.trim() || null, image_url: image_url || null, images: images || [],
        affiliate_url: affiliate_url || null, stock_type: stock_type || 'physical',
        tags: tags || [], is_featured: is_featured || false,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Editar produto (admin)
router.put('/admin/products/:id', authenticate, requireRole(['admin']), contentCreationLimiter, async (req: Request, res: Response) => {
  try {
    const errors = validateProductInput(req.body, true);
    if (errors.length > 0) return res.status(400).json({ error: errors.join('. ') });

    const updates: any = {};
    const fields = ['category_id', 'name', 'description', 'price', 'original_price', 'brand', 'image_url', 'images', 'affiliate_url', 'stock_type', 'tags', 'is_featured', 'is_active'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        updates[f] = f === 'name' || f === 'description' || f === 'brand' ? (req.body[f]?.trim() || null) : req.body[f];
      }
    });
    updates.updated_at = new Date();

    const { data, error } = await supabase
      .from('marketplace_products')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Deletar produto (admin)
router.delete('/admin/products/:id', authenticate, requireRole(['admin']), contentCreationLimiter, async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.from('marketplace_products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Produto removido' });
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

export = router;
