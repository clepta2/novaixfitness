// src/routes/testimonials.ts
// Rotas de depoimentos - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { sanitizeError } from '../middleware/errorHandler';

const router: Router = express.Router();

// Listar depoimentos aprovados (publico)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string || '10', 10);
    const { featured } = req.query;

    let query = supabase
      .from('testimonials')
      .select('id, name, initials, role, content, rating, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (err: any) {
    console.error('Erro ao buscar depoimentos:', err);
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Criar depoimento
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, role, content, rating } = req.body;

    if (!name || !content) {
      return res.status(400).json({ error: 'Nome e conteudo obrigatorios' });
    }

    if (content.length < 10 || content.length > 500) {
      return res.status(400).json({ error: 'Conteudo deve ter entre 10 e 500 caracteres' });
    }

    const initials = name
      .split(' ')
      .filter((w: string) => w.length > 1)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_id: (req as any).user.id,
        name,
        initials,
        role: role || 'Aluno',
        content,
        rating: Math.min(5, Math.max(1, rating || 5)),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Depoimento enviado para aprovacao', testimonial: data });
  } catch (err: any) {
    console.error('Erro ao criar depoimento:', err);
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Listar meus depoimentos
router.get('/my', authenticate, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', (req as any).user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

// Deletar meu depoimento
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', (req as any).user.id);

    if (error) throw error;

    res.json({ message: 'Depoimento removido' });
  } catch (err: any) {
    res.status(400).json({ error: sanitizeError(err) });
  }
});

export = router;
