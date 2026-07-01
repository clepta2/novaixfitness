// backend/src/routes/analytics.ts
// Rotas de analytics - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { defaultLimiter } from '../middleware/rateLimiter';

const router: Router = express.Router();

router.use(defaultLimiter);

router.post('/events', authenticate, async (req: Request, res: Response) => {
  try {
    const { events } = req.body;
    const userId = (req as any).user.id;
    const client = (req as any).supabase || supabase;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Events array required' });
    }

    const sanitized = events.map(e => ({
      event_name: e.event_name,
      properties: e.properties || {},
      user_id: userId,
      platform: e.platform || 'unknown',
      timestamp: e.timestamp || new Date().toISOString(),
      session_id: e.session_id,
    }));

    const { data, error } = await client
      .from('analytics_events')
      .insert(sanitized);

    if (error) throw error;

    res.json({ success: true, count: sanitized.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/events', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const client = (req as any).supabase || supabase;
    const { start_date, end_date, event_name, limit = '100' } = req.query;

    let query = client
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit as string, 10));

    if (start_date) query = query.gte('timestamp', start_date as string);
    if (end_date) query = query.lte('timestamp', end_date as string);
    if (event_name) query = query.eq('event_name', event_name as string);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const client = (req as any).supabase || supabase;
    const { start_date, end_date } = req.query;

    let query = client
      .from('analytics_events')
      .select('event_name')
      .eq('user_id', userId);

    if (start_date) query = query.gte('timestamp', start_date as string);
    if (end_date) query = query.lte('timestamp', end_date as string);

    const { data, error } = await query;
    if (error) throw error;

    const stats: Record<string, number> = {};
    for (const event of data || []) {
      stats[event.event_name] = (stats[event.event_name] || 0) + 1;
    }

    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/funnel', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const client = (req as any).supabase || supabase;

    const { data, error } = await client
      .rpc('get_user_funnel', { p_user_id: userId });

    if (error) throw error;

    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export = router;
