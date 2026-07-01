// src/routes/notifications.ts
// Rotas de Notificacoes Push - NOVAIX FITNESS

import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import supabase from '../config/supabase';
import { authenticate } from '../middleware/auth';
import { validateBody, sanitizeString } from '../middleware/validate';
import { sanitizeError } from '../middleware/errorHandler';

const router: Router = express.Router();
const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

async function sendPushNotification(pushToken: string, title: string, body: string, data: any = {}): Promise<any> {
  const message = {
    to: pushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  const response = await fetch(EXPO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  return response.json();
}

router.post('/send', authenticate, validateBody({
  title: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  body: { required: true, type: 'string', minLength: 1, maxLength: 500 },
  userId: { type: 'string', maxLength: 50 },
  type: { enum: ['marketing', 'reminder', 'achievement', 'system'] }
}), async (req: Request, res: Response) => {
  try {
    const { title, body, userId, type } = req.body;

    const targetUserId = userId || (req as any).user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token, consent_marketing')
      .eq('id', targetUserId)
      .single();

    if (!profile?.push_token) {
      return res.status(404).json({ error: 'No push token found' });
    }

    if (type === 'marketing' && !profile.consent_marketing) {
      return res.status(403).json({ error: 'User opted out of marketing notifications' });
    }

    const result = await sendPushNotification(profile.push_token, sanitizeString(title), sanitizeString(body), { type });

    res.json({ success: true, result });
  } catch (err) {
    console.error('Erro ao enviar notificacao:', err);
    res.status(500).json({ error: sanitizeError(err) });
  }
});

router.post('/send-bulk', authenticate, validateBody({
  title: { required: true, type: 'string', minLength: 1, maxLength: 100 },
  body: { required: true, type: 'string', minLength: 1, maxLength: 500 },
  type: { enum: ['marketing', 'reminder', 'system'] },
  filter: { type: 'object' }
}), async (req: Request, res: Response) => {
  try {
    const { title, body, type, filter } = req.body;

    let query = supabase
      .from('profiles')
      .select('push_token')
      .not('push_token', 'is', null);

    if (type === 'marketing') {
      query = query.eq('consent_marketing', true);
    }

    if (filter?.subscription_status) {
      query = query.eq('subscription_status', filter.subscription_status);
    }

    const { data: profiles } = await query;

    if (!profiles?.length) {
      return res.json({ sent: 0 });
    }

    const messages = (profiles || [])
      .filter(p => p.push_token)
      .map(p => ({
        to: p.push_token,
        sound: 'default',
        title: sanitizeString(title),
        body: sanitizeString(body),
        data: { type },
      }));

    const response = await fetch(EXPO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });

    const result = await response.json();

    res.json({ sent: messages.length, result });
  } catch (err) {
    console.error('Erro ao enviar notificacoes em massa:', err);
    res.status(500).json({ error: sanitizeError(err) });
  }
});

router.post('/schedule-reminder', authenticate, validateBody({
  hour: { type: 'number', min: 0, max: 23 },
  minute: { type: 'number', min: 0, max: 59 }
}), async (req: Request, res: Response) => {
  try {
    const { hour, minute } = req.body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', (req as any).user.id)
      .single();

    if (!profile?.push_token) {
      return res.status(404).json({ error: 'No push token' });
    }

    const triggerDate = new Date();
    triggerDate.setHours(hour || 19, minute || 0, 0, 0);

    if (triggerDate <= new Date()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    res.json({
      scheduled: true,
      triggerAt: triggerDate.toISOString(),
      message: 'Reminder scheduled. Client should handle local scheduling.',
    });
  } catch (err) {
    res.status(500).json({ error: sanitizeError(err) });
  }
});

export = router;
