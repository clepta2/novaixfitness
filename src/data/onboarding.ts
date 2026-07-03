// src/data/onboarding.ts
// Dados do onboarding - NOVAIX FITNESS

interface OnboardingOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  color?: string;
  defaultOn?: boolean;
  ageRange?: string;
}

export const GOALS: OnboardingOption[] = [
  { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame', description: 'Queima de gordura e perda de peso' },
  { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell', description: 'Hipertrofia e definição muscular' },
  { id: 'fitness', label: 'Condicionamento', icon: 'heart', description: 'Saúde, disposição e qualidade de vida' },
];

export const AGE_RANGES: OnboardingOption[] = [
  { id: '10-20', label: '10-20 anos', description: 'Adolescente' },
  { id: '21-30', label: '21-30 anos', description: 'Jovem adulto' },
  { id: '31-40', label: '31-40 anos', description: 'Adulto' },
];

export const GENDERS: OnboardingOption[] = [
  { id: 'male', label: 'Masculino', icon: 'male' },
  { id: 'female', label: 'Feminino', icon: 'female' },
];

export const BODY_MODELS: OnboardingOption[] = [
  { id: 'young_boy', label: 'Jovem Menino', description: 'Adolescente magro', icon: 'person', ageRange: '10-20' },
  { id: 'young_girl', label: 'Jovem Menina', description: 'Adolescente magra', icon: 'woman', ageRange: '10-20' },
  { id: 'thin_man', label: 'Homem Magro', description: 'Adulto magro', icon: 'man', ageRange: '21-30,31-40' },
  { id: 'thin_woman', label: 'Mulher Magra', description: 'Adulta magra', icon: 'woman', ageRange: '21-30,31-40' },
  { id: 'heavy_man', label: 'Homem Sobrepeso', description: 'Adulto acima do peso', icon: 'man', ageRange: '21-30,31-40' },
  { id: 'heavy_woman', label: 'Mulher Sobrepeso', description: 'Adulta acima do peso', icon: 'woman', ageRange: '21-30,31-40' },
];

export const LEVELS: OnboardingOption[] = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf', description: 'Nunca treinei ou estou parado há muito tempo' },
  { id: 'intermediate', label: 'Intermediário', icon: 'flash', description: 'Treino de vez em quando' },
  { id: 'advanced', label: 'Avançado', icon: 'flame', description: 'Já treino pesado constantemente' },
];

export const DAYS_PER_WEEK: OnboardingOption[] = [
  { id: '2', label: '2 dias', description: 'Mínimo para resultados' },
  { id: '3', label: '3 dias', description: 'Ideal para iniciantes' },
  { id: '4', label: '4 dias', description: 'Bom equilíbrio' },
  { id: '5', label: '5 dias', description: 'Para dedicados' },
  { id: '6', label: '6 dias', description: 'Máxima dedicação' },
];

export const WORKOUT_LOCATIONS: OnboardingOption[] = [
  { id: 'gym', label: 'Academia', icon: 'barbell', description: 'Equipamentos completos' },
  { id: 'home', label: 'Casa', icon: 'home', description: 'Peso corporal' },
  { id: 'park', label: 'Parque', icon: 'leaf', description: 'Ao ar livre' },
];

export const PREFERRED_TIMES: OnboardingOption[] = [
  { id: 'morning', label: 'Manhã', icon: 'sunny', description: '06h - 12h' },
  { id: 'afternoon', label: 'Tarde', icon: 'partly-sunny', description: '12h - 18h' },
  { id: 'night', label: 'Noite', icon: 'moon', description: '18h - 23h' },
];

export const STRESS_SLEEP: OnboardingOption[] = [
  { id: 'great', label: 'Ótimo', color: '#00E676' },
  { id: 'good', label: 'Bom', color: '#3B82F6' },
  { id: 'regular', label: 'Regular', color: '#FFD600' },
  { id: 'bad', label: 'Ruim', color: '#FF1744' },
];

export const PREFERRED_MUSCLES: OnboardingOption[] = [
  { id: 'chest', label: 'Peito' },
  { id: 'back', label: 'Costas' },
  { id: 'legs', label: 'Pernas' },
  { id: 'shoulders', label: 'Ombros' },
  { id: 'arms', label: 'Braços' },
  { id: 'abs', label: 'Abdômen' },
];

export const DIETARY_RESTRICTIONS: OnboardingOption[] = [
  { id: 'none', label: 'Nenhuma' },
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'lactose', label: 'Intolerância à lactose' },
  { id: 'gluten', label: 'Sem glúten' },
  { id: 'other', label: 'Outra' },
];

export const INSTRUCTOR_TYPES: OnboardingOption[] = [
  { id: 'endomorph', label: 'Endomorfo', description: 'Mais pesado, fácil pra ganhar gordura' },
  { id: 'ectomorph', label: 'Ectomorfo', description: 'Magro, dificuldade pra ganhar peso' },
  { id: 'mesomorph', label: 'Mesomorfo', description: 'Atlético, responde bem ao treino' },
];

export const NOTIFICATION_CHANNELS: OnboardingOption[] = [
  { id: 'push', label: 'Push', icon: 'phone-portrait', defaultOn: true },
  { id: 'email', label: 'E-mail', icon: 'mail', defaultOn: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', defaultOn: false },
  { id: 'sms', label: 'SMS', icon: 'chatbubble', defaultOn: false },
];

export const NOTIFICATION_TYPES: OnboardingOption[] = [
  { id: 'workout_reminder', label: 'Treino', icon: 'barbell', defaultOn: true },
  { id: 'hydration', label: 'Água', icon: 'water', defaultOn: true },
  { id: 'meal_plan', label: 'Comida', icon: 'restaurant', defaultOn: true },
  { id: 'achievements', label: 'Conquistas', icon: 'trophy', defaultOn: true },
  { id: 'progress', label: 'Progresso', icon: 'trending-up', defaultOn: true },
  { id: 'streak', label: 'Streak', icon: 'flame', defaultOn: true },
  { id: 'tips', label: 'Dicas', icon: 'bulb', defaultOn: false },
  { id: 'promotions', label: 'Promoções', icon: 'gift', defaultOn: false },
];

export const REFERRAL_SOURCES: OnboardingOption[] = [
  { id: 'referral', label: 'Indicação', icon: 'people' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { id: 'google', label: 'Google', icon: 'logo-google' },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { id: 'other', label: 'Outro', icon: 'help-circle' },
];
