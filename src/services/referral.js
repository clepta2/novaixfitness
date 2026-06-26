// src/services/referral.js
// Serviço de referral/convites - NOVAIX FITNESS

import { supabase } from '../config/supabase';
import * as Sharing from 'expo-sharing';

// Gerar código único baseado no user ID
export function generateReferralCode(userId) {
  if (!userId) return null;
  const shortId = userId.substring(0, 8).toUpperCase();
  return `NOVAIX${shortId}`;
}

// Buscar dados de referral do usuário
export async function getReferralData(userId) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || {
      referral_code: generateReferralCode(userId),
      total_referrals: 0,
      successful_referrals: 0,
      bonus_days: 0,
    };
  } catch (err) {
    console.error('Erro ao buscar referral:', err);
    return {
      referral_code: generateReferralCode(userId),
      total_referrals: 0,
      successful_referrals: 0,
      bonus_days: 0,
    };
  }
}

// Registrar um convite enviado
export async function trackReferral(referrerId) {
  if (!referrerId) return;

  try {
    const { error } = await supabase
      .from('referrals')
      .upsert({
        referrer_id: referrerId,
        referral_code: generateReferralCode(referrerId),
        total_referrals: supabase.rpc('increment_referral_count', { user_id: referrerId }),
      }, { onConflict: 'referrer_id' });

    if (error) throw error;
  } catch (err) {
    console.error('Erro ao registrar referral:', err);
  }
}

// Compartilhar convite
export async function shareReferral(userId) {
  const code = generateReferralCode(userId);
  const message = `🏋️ Junte-se a mim no NOVAIX Fitness!\n\n` +
    `Use meu código: ${code}\n` +
    `E ganhe 7 dias grátis!\n\n` +
    `Baixe agora: https://novaixfitness.com/ref/${code}`;

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(message, {
        mimeType: 'text/plain',
        dialogTitle: 'Convidar amigo',
      });
      await trackReferral(userId);
    }
  } catch (error) {
    console.error('Erro ao compartilhar convite:', error);
  }
}

// Validar código de referral
export async function validateReferralCode(code) {
  if (!code || code.length < 8) return null;

  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('referrer_id')
      .eq('referral_code', code.toUpperCase())
      .single();

    if (error || !data) return null;
    return data.referrer_id;
  } catch {
    return null;
  }
}

// Aplicar bônus de referral
export async function applyReferralBonus(userId, referrerId) {
  if (!userId || !referrerId) return;

  try {
    // Adicionar 30 dias ao novo usuário
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', userId);

    // Adicionar 30 dias ao quem indicou
    const { data: referrer } = await supabase
      .from('profiles')
      .select('bonus_days')
      .eq('id', referrerId)
      .single();

    if (referrer) {
      await supabase
        .from('profiles')
        .update({ bonus_days: (referrer.bonus_days || 0) + 30 })
        .eq('id', referrerId);
    }

    // Atualizar contagem
    await supabase
      .from('referrals')
      .update({ successful_referrals: supabase.rpc('increment_successful_referrals', { user_id: referrerId }) })
      .eq('referrer_id', referrerId);

    return true;
  } catch (err) {
    console.error('Erro ao aplicar bônus:', err);
    return false;
  }
}
