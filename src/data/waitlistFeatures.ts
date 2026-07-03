interface WaitlistFeature {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: string;
}

export const WAITLIST_FEATURES: WaitlistFeature[] = [
  {
    id: '1',
    title: 'Apple Watch',
    icon: '⌚',
    description: 'Timer e batimentos no pulso',
    status: 'coming_soon',
  },
  {
    id: '2',
    title: 'Corrida GPS',
    icon: '🏃',
    description: 'Rastreie seus percursos ao ar livre',
    status: 'coming_soon',
  },
  {
    id: '3',
    title: 'Planos Alimentares IA',
    icon: '🤖',
    description: 'Nutrição personalizada por inteligência artificial',
    status: 'coming_soon',
  },
  {
    id: '4',
    title: 'Desafios em Grupo',
    icon: '🏆',
    description: 'Compita com amigos em desafios semanais',
    status: 'coming_soon',
  },
];
