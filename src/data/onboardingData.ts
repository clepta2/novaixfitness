// src/data/onboardingData.ts
// Dados do onboarding

import type { OnboardingOption, AgeRange, GenderOption, BodyModel, LevelOption, DayOption, LocationOption, TimeOption, StressSleepOption, MuscleOption, DietaryOption, BodyTypeOption, NotificationChannel, NotificationType, ReferralSource } from './onboardingTypes';

export const GOALS: OnboardingOption[] = [
  { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame', description: 'Queima de gordura e perda de peso' },
  { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell', description: 'Hipertrofia e definicao muscular' },
  { id: 'fitness', label: 'Condicionamento', icon: 'heart', description: 'Saude, disposicao e qualidade de vida' },
];

export const AGE_RANGES: AgeRange[] = [
  { id: '10-20', label: '10-20 anos', description: 'Adolescente' },
  { id: '21-30', label: '21-30 anos', description: 'Jovem adulto' },
  { id: '31-40', label: '31-40 anos', description: 'Adulto' },
];

export const GENDERS: GenderOption[] = [
  { id: 'male', label: 'Masculino', icon: 'male' },
  { id: 'female', label: 'Feminino', icon: 'female' },
];

export const BODY_MODELS: BodyModel[] = [
  { id: 'young_boy', label: 'Jovem Menino', description: 'Adolescente magro', icon: 'person', ageRange: '10-20' },
  { id: 'young_girl', label: 'Jovem Menina', description: 'Adolescente magra', icon: 'woman', ageRange: '10-20' },
  { id: 'thin_man', label: 'Homem Magro', description: 'Adulto magro', icon: 'man', ageRange: '21-30,31-40' },
  { id: 'thin_woman', label: 'Mulher Magra', description: 'Adulta magra', icon: 'woman', ageRange: '21-30,31-40' },
  { id: 'heavy_man', label: 'Homem Sobrepeso', description: 'Adulto acima do peso', icon: 'man', ageRange: '21-30,31-40' },
  { id: 'heavy_woman', label: 'Mulher Sobrepeso', description: 'Adulta acima do peso', icon: 'woman', ageRange: '21-30,31-40' },
];

export const LEVELS: LevelOption[] = [
  { id: 'beginner', label: 'Iniciante', icon: 'leaf', description: 'Nunca treinei ou estou parado ha muito tempo' },
  { id: 'intermediate', label: 'Intermediario', icon: 'flash', description: 'Treino de vez em quando' },
  { id: 'advanced', label: 'Avancado', icon: 'flame', description: 'Ja treino pesado constantemente' },
];

export const DAYS_PER_WEEK: DayOption[] = [
  { id: 2, label: '2 dias', description: 'Minimo para resultados' },
  { id: 3, label: '3 dias', description: 'Ideal para iniciantes' },
  { id: 4, label: '4 dias', description: 'Bom equilibrio' },
  { id: 5, label: '5 dias', description: 'Para dedicados' },
  { id: 6, label: '6 dias', description: 'Maxima dedicacao' },
];

export const WORKOUT_LOCATIONS: LocationOption[] = [
  { id: 'gym', label: 'Academia', icon: 'barbell', description: 'Equipamentos completos' },
  { id: 'home', label: 'Casa', icon: 'home', description: 'Peso corporal' },
  { id: 'park', label: 'Parque', icon: 'leaf', description: 'Ao ar livre' },
];

export const PREFERRED_TIMES: TimeOption[] = [
  { id: 'morning', label: 'Manha', icon: 'sunny', description: '06h - 12h' },
  { id: 'afternoon', label: 'Tarde', icon: 'partly-sunny', description: '12h - 18h' },
  { id: 'night', label: 'Noite', icon: 'moon', description: '18h - 23h' },
];

export const STRESS_SLEEP: StressSleepOption[] = [
  { id: 'great', label: 'Otimo', color: '#00E676' },
  { id: 'good', label: 'Bom', color: '#3B82F6' },
  { id: 'regular', label: 'Regular', color: '#FFD600' },
  { id: 'bad', label: 'Ruim', color: '#FF1744' },
];

export const PREFERRED_MUSCLES: MuscleOption[] = [
  { id: 'chest', label: 'Peito' },
  { id: 'back', label: 'Costas' },
  { id: 'legs', label: 'Pernas' },
  { id: 'shoulders', label: 'Ombros' },
  { id: 'arms', label: 'Bracos' },
  { id: 'abs', label: 'Abdomen' },
];

export const DIETARY_RESTRICTIONS: DietaryOption[] = [
  { id: 'none', label: 'Nenhuma' },
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'lactose', label: 'Intolerancia a lactose' },
  { id: 'gluten', label: 'Sem gluten' },
  { id: 'other', label: 'Outra' },
];

export const INSTRUCTOR_TYPES: BodyTypeOption[] = [
  { id: 'endomorph', label: 'Endomorfo', description: 'Mais pesado, facil pra ganhar gordura' },
  { id: 'ectomorph', label: 'Ectomorfo', description: 'Magro, dificuldade pra ganhar peso' },
  { id: 'mesomorph', label: 'Mesomorfo', description: 'Atletico, responde bem ao treino' },
];

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  { id: 'push', label: 'Push', icon: 'phone-portrait', defaultOn: true },
  { id: 'email', label: 'E-mail', icon: 'mail', defaultOn: true },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', defaultOn: false },
  { id: 'sms', label: 'SMS', icon: 'chatbubble', defaultOn: false },
];

export const NOTIFICATION_TYPES: NotificationType[] = [
  { id: 'workout_reminder', label: 'Treino', icon: 'barbell', defaultOn: true },
  { id: 'hydration', label: 'Agua', icon: 'water', defaultOn: true },
  { id: 'meal_plan', label: 'Comida', icon: 'restaurant', defaultOn: true },
  { id: 'achievements', label: 'Conquistas', icon: 'trophy', defaultOn: true },
  { id: 'progress', label: 'Progresso', icon: 'trending-up', defaultOn: true },
  { id: 'streak', label: 'Streak', icon: 'flame', defaultOn: true },
  { id: 'tips', label: 'Dicas', icon: 'bulb', defaultOn: false },
  { id: 'promotions', label: 'Promocoes', icon: 'gift', defaultOn: false },
];

export const REFERRAL_SOURCES: ReferralSource[] = [
  { id: 'referral', label: 'Indicacao', icon: 'people' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { id: 'google', label: 'Google', icon: 'logo-google' },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { id: 'other', label: 'Outro', icon: 'help-circle' },
];
