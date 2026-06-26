// src/routes/notifications.js
// Rotas de Notificacoes Push - NOVAIX FITNESS

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const EXPO_API_URL = 'https://exp.host/--/api/v2/push/send';

async function sendPushNotification(pushToken, title, body, data = {}) {
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

router.post('/send', authenticate, async (req, res) => {
  try {
    const { title, body, userId, type } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    let targetUserId = userId || req.user.id;

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

    const result = await sendPushNotification(profile.push_token, title, body, { type });

    res.json({ success: true, result });
  } catch (err) {
    console.error('Erro ao enviar notificacao:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/send-bulk', authenticate, async (req, res) => {
  try {
    const { title, body, type, filter } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

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

    const messages = profiles
      .filter(p => p.push_token)
      .map(p => ({
        to: p.push_token,
        sound: 'default',
        title,
        body,
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
    res.status(500).json({ error: err.message });
  }
});

router.post('/schedule-reminder', authenticate, async (req, res) => {
  try {
    const { hour, minute } = req.body;

    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', req.user.id)
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
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
