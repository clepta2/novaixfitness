// src/services/coupon.js
// Serviço de cupons de desconto - NOVAIX FITNESS

import { supabase } from '../config/supabase';

// Cupons pré-definidos para demonstração
const demoCoupons = [
  { code: 'NOVAIX10', discount: 10, type: 'percent', validUntil: '2026-12-31', maxUses: 100 },
  { code: 'BEMVINDO20', discount: 20, type: 'percent', validUntil: '2026-12-31', maxUses: 50 },
  { code: 'TREINO30', discount: 30, type: 'fixed', validUntil: '2026-12-31', maxUses: 30 },
  { code: 'GRATIS7', discount: 7, type: 'days', validUntil: '2026-12-31', maxUses: 200 },
];

// Validar cupom
export async function validateCoupon(code) {
  if (!code || code.length < 3) return { valid: false, error: 'Código inválido' };

  const upperCode = code.toUpperCase().trim();

  // Verificar nos cupons demo primeiro
  const demoCoupon = demoCoupons.find(c => c.code === upperCode);
  if (demoCoupon) {
    if (new Date(demoCoupon.validUntil) < new Date()) {
      return { valid: false, error: 'Cupom expirado' };
    }
    return {
      valid: true,
      code: demoCoupon.code,
      discount: demoCoupon.discount,
      type: demoCoupon.type,
      description: getDiscountDescription(demoCoupon),
    };
  }

  // Verificar no banco de dados
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', upperCode)
      .eq('active', true)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Cupom não encontrado' };
    }

    if (new Date(data.valid_until) < new Date()) {
      return { valid: false, error: 'Cupom expirado' };
    }

    if (data.max_uses && data.current_uses >= data.max_uses) {
      return { valid: false, error: 'Cupom atingiu limite de uso' };
    }

    return {
      valid: true,
      code: data.code,
      discount: data.discount,
      type: data.type,
      description: getDiscountDescription(data),
    };
  } catch (err) {
    return { valid: false, error: 'Erro ao validar cupom' };
  }
}

// Aplicar cupom no preço
export function applyCoupon(price, coupon) {
  if (!coupon || !coupon.valid) return price;

  let finalPrice = price;

  if (coupon.type === 'percent') {
    finalPrice = price * (1 - coupon.discount / 100);
  } else if (coupon.type === 'fixed') {
    finalPrice = Math.max(0, price - coupon.discount);
  } else if (coupon.type === 'days') {
    finalPrice = 0; // Dias grátis
  }

  return Math.round(finalPrice * 100) / 100;
}

// Gerar descrição do desconto
function getDiscountDescription(coupon) {
  if (coupon.type === 'percent') return `${coupon.discount}% de desconto`;
  if (coupon.type === 'fixed') return `R$ ${coupon.discount} de desconto`;
  if (coupon.type === 'days') return `${coupon.discount} dias grátis`;
  return 'Desconto aplicado';
}

// Registrar uso do cupom
export async function recordCouponUse(code, userId) {
  if (!code || !userId) return;

  try {
    // Incrementar uso no banco
    await supabase
      .from('coupons')
      .update({ current_uses: supabase.rpc('increment_coupon_uses', { coupon_code: code.toUpperCase() }) })
      .eq('code', code.toUpperCase());

    // Registrar no histórico
    await supabase
      .from('coupon_usage')
      .insert({
        coupon_code: code.toUpperCase(),
        user_id: userId,
        used_at: new Date().toISOString(),
      });
  } catch (err) {
    console.error('Erro ao registrar uso do cupom:', err);
  }
}

// Listar cupons disponíveis (admin)
export async function listCoupons() {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao listar cupons:', err);
    return demoCoupons;
  }
}
