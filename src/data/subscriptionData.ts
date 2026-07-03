// src/data/subscriptionData.ts
// Dados constantes para tela de assinatura - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

interface StatusItem {
  label: string;
  color: string;
  icon: string;
}

interface InfoItem {
  icon: string;
  color: string;
  label: string;
  title: string;
  description: string;
  desc: string;
}

export const STATUS_MAP: Record<string, StatusItem> = {
  active: { label: 'Ativo', color: COLORS.success, icon: 'checkmark-circle' },
  overdue: { label: 'Atrasado', color: COLORS.attention, icon: 'warning' },
  cancelled: { label: 'Cancelado', color: COLORS.error, icon: 'close-circle' },
  inactive: { label: 'Inativo', color: COLORS.textMuted, icon: 'pause-circle' },
  free: { label: 'Gratuito', color: COLORS.textMuted, icon: 'person' },
};

export const INFO_ITEMS: InfoItem[] = [
  { icon: 'shield-checkmark-outline', color: COLORS.primary, label: 'Segurança', title: 'Segurança', description: 'Pagamentos via Asaas com criptografia SSL', desc: 'Pagamentos via Asaas com criptografia SSL' },
  { icon: 'refresh-outline', color: COLORS.info, label: 'Renovação', title: 'Renovação', description: 'Cobrança automática todo mês', desc: 'Cobrança automática todo mês' },
  { icon: 'card-outline', color: COLORS.attention, label: 'Formas de Pagamento', title: 'Formas de Pagamento', description: 'PIX ou Cartão de Crédito', desc: 'PIX ou Cartão de Crédito' },
];
