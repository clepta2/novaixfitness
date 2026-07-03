// src/services/totp.js
// Serviço TOTP para 2FA - NOVAIX FITNESS

import * as OTPAuth from 'otpauth';
import { supabase } from '../config/supabase';

const ISSUER = 'NOVAIX Fitness';
const ALGORITHM = 'SHA1';
const DIGITS = 6;
const PERIOD = 30;

export function generateSecret(userId) {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: `Admin ${userId}`,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: new OTPAuth.Secret({ size: 20 }),
  });
  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

export function verifyToken(secret, token) {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

export async function setup2FA(userId) {
  const { secret, uri } = generateSecret(userId);

  const { error } = await supabase
    .from('admin_2fa')
    .upsert({
      user_id: userId,
      secret: secret,
      enabled: false,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) throw error;
  return { secret, uri };
}

export async function confirm2FA(userId, token) {
  const { data, error } = await supabase
    .from('admin_2fa')
    .select('secret')
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error('Configuração 2FA não encontrada');

  const valid = verifyToken(data.secret, token);
  if (!valid) throw new Error('Código inválido. Tente novamente.');

  const { error: updateError } = await supabase
    .from('admin_2fa')
    .update({ enabled: true, confirmed_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (updateError) throw updateError;
  return true;
}

export async function verify2FA(userId, token) {
  const { data, error } = await supabase
    .from('admin_2fa')
    .select('secret, enabled')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  if (!data.enabled) return false;

  return verifyToken(data.secret, token);
}

export async function is2FAEnabled(userId) {
  const { data } = await supabase
    .from('admin_2fa')
    .select('enabled')
    .eq('user_id', userId)
    .single();

  return data?.enabled === true;
}

export async function disable2FA(userId) {
  const { error } = await supabase
    .from('admin_2fa')
    .update({ enabled: false })
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}
