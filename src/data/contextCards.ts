import { COLORS } from '../constants/colors';

interface ContextCard {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  bgGradient: string[];
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'night' {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 19) return 'afternoon';
  return 'night';
}

export const CONTEXT_CARDS: Record<string, ContextCard> = {
  morning: {
    icon: 'sunny-outline',
    iconColor: '#FFD700',
    title: 'BOM-DIA, ATLETA',
    subtitle: 'Foco e Alongamento Matinal',
    description: 'Comece o dia com energia. Alongue os músculos e ative o corpo para o treino de hoje.',
    actionLabel: 'INICIAR AQUECIMENTO',
    actionRoute: '/warmup',
    bgGradient: ['#FFD70020', '#FFA50010'],
  },
  afternoon: {
    icon: 'flame-outline',
    iconColor: COLORS.primary,
    title: 'HORA DO TREINO',
    subtitle: 'Treino Nix Inteligente',
    description: 'Seu treino do dia está pronto. Vamos suar!',
    actionLabel: 'INICIAR TREINO',
    actionRoute: '/player-list',
    bgGradient: [COLORS.primary + '20', COLORS.primary + '10'],
  },
  night: {
    icon: 'moon-outline',
    iconColor: '#7B68EE',
    title: 'NOITE DE RECUPERAÇÃO',
    subtitle: 'Água, Sono e Descanso',
    description: 'Registre sua hidratação e prepare-se para uma noite de sono de qualidade.',
    actionLabel: 'REGISTRAR NOITE',
    actionRoute: '/recovery',
    bgGradient: ['#7B68EE20', '#5B4ACF10'],
  },
};
