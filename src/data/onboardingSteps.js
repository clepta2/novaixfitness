// src/data/onboardingSteps.js
// Onboarding - Completo com todas as informações

// ═══════════════════════════════════════════
// FASE 1: CONHECER O CLIENTE
// ═══════════════════════════════════════════

export const WELCOME_STEP = {
  id: 'welcome',
  type: 'info',
  title: 'VAMOS TE CONHECER!',
  subtitle: 'Para criar um plano 100% personalizado, vamos entender você e seu corpo.',
  bullets: ['Seu objetivo e perfil', 'Sua experiência e rotina', 'Condição do seu corpo'],
  securityNote: 'Suas respostas são salvas com segurança',
  buttonText: 'COMEÇAR',
  nextStep: 'goal',
  phase: 1,
};

export const GOAL_STEP = {
  id: 'goal',
  type: 'single_select',
  field: 'goal',
  title: 'O QUE VOCÊ BUSCA?',
  subtitle: 'Isso define a estrutura do seu plano',
  options: [
    { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame' },
    { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell' },
    { id: 'fitness', label: 'Condicionamento', icon: 'heart' },
  ],
  nextStep: 'personal',
  phase: 1,
};

export const PERSONAL_STEP = {
  id: 'personal',
  type: 'multi_section',
  title: 'SOBRE VOCÊ',
  subtitle: 'Esses dados definem a intensidade ideal',
  sections: [
    { id: 'age_range', field: 'age_range', label: 'IDADE', subtitle: 'A intensidade muda com a idade', type: 'single_select', options: [{ id: '10-17', label: '10-17' }, { id: '18-25', label: '18-25' }, { id: '26-35', label: '26-35' }, { id: '36-45', label: '36-45' }, { id: '46-55', label: '46-55' }, { id: '56-65', label: '56-65' }, { id: '66-100', label: '66+' }] },
    { id: 'gender', field: 'gender', label: 'GÊNERO', subtitle: 'Afeta distribuição muscular', type: 'single_select', options: [{ id: 'male', label: 'Masculino', icon: 'male' }, { id: 'female', label: 'Feminino', icon: 'female' }] },
  ],
  nextStep: 'experience',
  phase: 1,
};

export const EXPERIENCE_STEP = {
  id: 'experience',
  type: 'multi_section',
  title: 'SUA EXPERIÊNCIA',
  subtitle: 'Já treinou antes? Isso ajuda a personalizar',
  sections: [
    { id: 'has_experience', field: 'has_experience', label: 'JÁ TREINOU ANTES?', subtitle: 'Não tem problema se nunca treinou', type: 'single_select', options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] },
    { id: 'experience_where', field: 'experience_where', label: 'ONDE TREINOU?', subtitle: 'Academia, casa, parque...', type: 'single_select', options: [{ id: 'gym', label: 'Academia' }, { id: 'home', label: 'Casa' }, { id: 'park', label: 'Parque' }, { id: 'mixed', label: 'Vários lugares' }], conditional: 'has_experience === yes' },
    { id: 'experience_duration', field: 'experience_duration', label: 'QUANTO TEMPO?', subtitle: 'Duração da experiência', type: 'single_select', options: [{ id: 'less_3m', label: 'Menos de 3 meses' }, { id: '3m_1y', label: '3 meses a 1 ano' }, { id: '1y_3y', label: '1 a 3 anos' }, { id: 'more_3y', label: 'Mais de 3 anos' }], conditional: 'has_experience === yes' },
  ],
  nextStep: 'body',
  phase: 1,
};

export const MOTIVATION_STEP = {
  id: 'motivation',
  type: 'multi_section',
  title: 'MOTIVAÇÃO',
  subtitle: 'Como você se sente sobre treinar?',
  sections: [
    { id: 'motivation_level', field: 'motivation_level', label: 'NÍVEL DE MOTIVAÇÃO', subtitle: 'O quão motivado você está?', type: 'single_select', options: [{ id: '1', label: '1 - Baixa' }, { id: '2', label: '2 - Média' }, { id: '3', label: '3 - Boa' }, { id: '4', label: '4 - Alta' }, { id: '5', label: '5 - Extrema' }] },
    { id: 'training_style', field: 'training_style', label: 'COMO GOSTA DE TREINAR?', subtitle: 'Isso define o tipo de exercícios', type: 'single_select', options: [{ id: 'solo', label: 'Sozinho', icon: 'person' }, { id: 'partner', label: 'Com amigo', icon: 'people' }, { id: 'coach', label: 'Com personal', icon: 'fitness' }, { id: 'class', label: 'Em aula', icon: 'people' }] },
  ],
  nextStep: 'devices',
  phase: 1,
};

export const DEVICES_STEP = {
  id: 'devices',
  type: 'multi_section',
  title: 'SEUS DISPOSITIVOS',
  subtitle: 'Conectamos com apps que você já usa',
  sections: [
    { id: 'has_smartwatch', field: 'has_smartwatch', label: 'SMARTWATCH', subtitle: 'Apple Watch, Galaxy Watch, etc', type: 'single_select', options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] },
    { id: 'has_spotify', field: 'has_spotify', label: 'SPOTIFY', subtitle: 'Músicas para treinar', type: 'single_select', options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] },
    { id: 'has_strava', field: 'has_strava', label: 'STRAVA', subtitle: 'Corrida e ciclismo', type: 'single_select', options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] },
  ],
  nextStep: 'lifestyle',
  phase: 1,
};

// ═══════════════════════════════════════════
// FASE 2: CONHECER O CORPO
// ═══════════════════════════════════════════

export const BODY_STEP = {
  id: 'body',
  type: 'multi_section',
  title: 'SEU CORPO',
  subtitle: 'Vamos medir sua condição física',
  sections: [
    { id: 'weight', field: 'weight', label: 'PESO', subtitle: 'Calcula IMC e hidratação', type: 'number_input', unit: 'kg', min: 30, max: 250, defaultValue: 70, validation: { required: true, min: 30, max: 250, message: 'Peso deve ser entre 30 e 250 kg' } },
    { id: 'height', field: 'height', label: 'ALTURA', subtitle: 'Calcula IMC', type: 'number_input', unit: 'cm', min: 100, max: 250, defaultValue: 170, validation: { required: true, min: 100, max: 250, message: 'Altura deve ser entre 100 e 250 cm' } },
    { id: 'has_tape', field: 'has_tape', label: 'MEDIDAS', subtitle: 'Tem fita métrica?', type: 'single_select', options: [{ id: 'yes', label: 'Sim' }, { id: 'no', label: 'Não' }] },
    { id: 'chest', field: 'chest', label: 'PEITO (cm)', type: 'number_input', unit: 'cm', min: 50, max: 150, conditional: 'has_tape === yes', validation: { min: 50, max: 150, message: 'Peito deve ser entre 50 e 150 cm' } },
    { id: 'waist', field: 'waist', label: 'CINTURA (cm)', type: 'number_input', unit: 'cm', min: 40, max: 150, conditional: 'has_tape === yes', validation: { min: 40, max: 150, message: 'Cintura deve ser entre 40 e 150 cm' } },
    { id: 'hip', field: 'hip', label: 'QUADRIL (cm)', type: 'number_input', unit: 'cm', min: 50, max: 150, conditional: 'has_tape === yes', validation: { min: 50, max: 150, message: 'Quadril deve ser entre 50 e 150 cm' } },
  ],
  nextStep: 'injuries',
  phase: 2,
};

export const INJURIES_STEP = {
  id: 'injuries',
  type: 'injury_flow',
  title: 'LIMITAÇÕES',
  subtitle: 'Vamos adaptar exercícios para evitar dor',
  sections: [
    { id: 'injuries', field: 'injuries', label: 'RESTRIÇÕES', subtitle: 'Alguma dor ou limitação?', type: 'injury_selector', hasDescription: true, hasSeverity: true },
    { id: 'preferred_muscles', field: 'preferred_muscles', label: 'MÚSCULOS PREFERIDOS', subtitle: 'Treinamos o que você gosta', type: 'multi_select_pills', options: [{ id: 'chest', label: 'Peito' }, { id: 'back', label: 'Costas' }, { id: 'legs', label: 'Pernas' }, { id: 'shoulders', label: 'Ombros' }, { id: 'arms', label: 'Braços' }, { id: 'abs', label: 'Abdômen' }] },
  ],
  nextStep: 'lifestyle',
  phase: 2,
};

export const LIFESTYLE_STEP = {
  id: 'lifestyle',
  type: 'multi_section',
  title: 'SUA ROTINA',
  subtitle: 'Como você vive impacta como treina',
  sections: [
    { id: 'preferred_time', field: 'preferred_time', label: 'HORÁRIO', subtitle: 'Ajustamos aquecimento', type: 'single_select', options: [{ id: 'morning', label: 'Manhã', icon: 'sunny' }, { id: 'afternoon', label: 'Tarde', icon: 'partly-sunny' }, { id: 'night', label: 'Noite', icon: 'moon' }] },
    { id: 'stress_sleep', field: 'stress_sleep', label: 'ESTRESSE/SONO', subtitle: 'Impacta volume do treino', type: 'single_select', options: [{ id: 'great', label: 'Ótimo', color: '#00E676' }, { id: 'good', label: 'Bom', color: '#3B82F6' }, { id: 'regular', label: 'Regular', color: '#FFD600' }, { id: 'bad', label: 'Ruim', color: '#FF1744' }] },
    { id: 'dietary_restrictions', field: 'dietary_restrictions', label: 'ALIMENTAÇÃO', subtitle: 'Plano alimentar adequado', type: 'single_select', options: [{ id: 'none', label: 'Nenhuma' }, { id: 'vegetarian', label: 'Vegetariano' }, { id: 'vegan', label: 'Vegano' }, { id: 'lactose', label: 'Lactose' }, { id: 'gluten', label: 'Sem glúten' }] },
  ],
  nextStep: 'workout',
  phase: 2,
};

export const WORKOUT_STEP = {
  id: 'workout',
  type: 'redirect',
  redirectScreen: '/onboarding/treino',
  nextStep: 'notifications',
  phase: 2,
};

export const NOTIFICATIONS_STEP = {
  id: 'notifications',
  type: 'toggles',
  title: 'NOTIFICAÇÕES',
  subtitle: 'Como quer receber lembretes?',
  channels: [
    { id: 'push', label: 'Push', icon: 'phone-portrait', defaultOn: true },
    { id: 'email', label: 'E-mail', icon: 'mail', defaultOn: true },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'logo-whatsapp', defaultOn: false },
    { id: 'sms', label: 'SMS', icon: 'chatbubble', defaultOn: false },
  ],
  types: [
    { id: 'workout_reminder', label: 'Treino', icon: 'barbell', defaultOn: true },
    { id: 'hydration', label: 'Água', icon: 'water', defaultOn: true },
    { id: 'meal_plan', label: 'Comida', icon: 'restaurant', defaultOn: true },
    { id: 'achievements', label: 'Conquistas', icon: 'trophy', defaultOn: true },
  ],
  note: 'Altera depois em Configurações',
  nextStep: 'summary',
  phase: 2,
};

export const SUMMARY_STEP = {
  id: 'summary',
  type: 'summary',
  title: 'TUDO CERTO!',
  subtitle: 'Seu plano personalizado está sendo criado',
  nextStep: 'processing',
  phase: 2,
};


