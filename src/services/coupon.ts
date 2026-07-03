// src/services/coupon.ts
// Re-export shim → coupons.ts (canonical)
// Mantido para backward compatibility com imports existentes

export { recordCouponUsage as recordCouponUse } from './coupons';

import { supabase } from '../config/supabase';
import { tryIf } from '../utils/tryIf';

const demoCoupons = [
  { code: 'NOVAIX10', discount: 10, type: 'percent', validUntil: '2026-12-31' },
  { code: 'BEMVINDO20', discount: 20, type: 'percent', validUntil: '2026-12-31' },
  { code: 'TREINO30', discount: 30, type: 'fixed', validUntil: '2026-12-31' },
  { code: 'GRATIS7', discount: 7, type: 'days', validUntil: '2026-12-31' },
];

export async function validateCoupon(code: string | null) {
  if (!code || code.length < 3) return { valid: false, error: 'Código inválido' };
  const upperCode = code.toUpperCase().trim();

  const demo = demoCoupons.find(c => c.code === upperCode);
  if (demo) {
    if (new Date(demo.validUntil) < new Date()) return { valid: false, error: 'Cupom expirado' };
    return { valid: true, code: demo.code, discount: demo.discount, type: demo.type };
  }

  const result = await tryIf(async () => {
    const { data, error } = await supabase
      .from('coupons').select('*').eq('code', upperCode).eq('active', true).single();
    if (error || !data) return { valid: false, error: 'Cupom não encontrado' };
    if (new Date(data.valid_until) < new Date()) return { valid: false, error: 'Cupom expirado' };
    if (data.max_uses && data.current_uses >= data.max_uses) return { valid: false, error: 'Cupom atingiu limite' };
    return { valid: true, code: data.code, discount: data.discount, type: data.type };
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : { valid: false, error: 'Erro ao validar cupom' };
}

export function applyCoupon(price: number, coupon: { valid?: boolean; type?: string; discount?: number } | null) {
  if (!coupon || !coupon.valid) return price;
  let finalPrice = price;
  if (coupon.type === 'percent') {
    finalPrice = price * (1 - (coupon.discount || 0) / 100);
  } else if (coupon.type === 'fixed') {
    finalPrice = Math.max(0, price - (coupon.discount || 0));
  } else if (coupon.type === 'days') {
    finalPrice = 0;
  }
  return Math.round(finalPrice * 100) / 100;
}

export async function listCoupons() {
  const result = await tryIf(async () => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : demoCoupons;
}
