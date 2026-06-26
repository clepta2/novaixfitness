// src/data/subscriptionData.js
// Dados constantes para tela de assinatura - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

export const STATUS_MAP = {
  active: { label: 'Ativo', color: COLORS.success, icon: 'checkmark-circle' },
  overdue: { label: 'Atrasado', color: COLORS.attention, icon: 'warning' },
  cancelled: { label: 'Cancelado', color: COLORS.error, icon: 'close-circle' },
  inactive: { label: 'Inativo', color: COLORS.textMuted, icon: 'pause-circle' },
  free: { label: 'Gratuito', color: COLORS.textMuted, icon: 'person' },
};

export const INFO_ITEMS = [
  { icon: 'shield-checkmark-outline', title: 'Segurança', desc: 'Pagamentos via Asaas com criptografia SSL' },
  { icon: 'refresh-outline', title: 'Renovação', desc: 'Cobrança automática todo mês' },
  { icon: 'card-outline', title: 'Formas de Pagamento', desc: 'PIX ou Cartão de Crédito' },
];
