// src/data/onboardingSteps.ts
// Onboarding simplificado — 5 etapas (era 12)

// ═══════════════════════════════════════════
// ETAPA 1: OBJETIVO (was: welcome + goal)
// ═══════════════════════════════════════════

export const GOAL_STEP = {
  id: 'goal',
  type: 'single_select',
  field: 'goal',
  title: 'O QUE VOCÊ BUSCA?',
  subtitle: 'Para criar um plano personalizado, vamos entender você.',
  intro: 'Seu objetivo define a estrutura do seu plano de treino e alimentação.',
  options: [
    { id: 'weight_loss', label: 'Emagrecimento', icon: 'flame' },
    { id: 'muscle_gain', label: 'Ganho de Massa', icon: 'barbell' },
    { id: 'fitness', label: 'Condicionamento', icon: 'heart' },
  ],
  nextStep: 'you',
  phase: 1,
};

// ═══════════════════════════════════════════
// ETAPA 2: VOCÊ (was: personal + experience + motivation)
// ═══════════════════════════════════════════

export const YOU_STEP = {
  id: 'you',
  type: 'multi_section',
  title: 'SOBRE VOCÊ',
  subtitle: 'Esses dados definem a intensidade ideal do seu treino',
  sections: [
    { id: 'age_range', field: 'age_range', label: 'IDADE', type: 'single_select', options: [{ id: '10-17', label: '10-17' }, { id: '18-25', label: '18-25' }, { id: '26-35', label: '26-35' }, { id: '36-45', label: '36-45' }, { id: '46-55', label: '46-55' }, { id: '56-65', label: '56-65' }, { id: '66-100', label: '66+' }] },
    { id: 'gender', field: 'gender', label: 'GÊNERO', type: 'single_select', options: [{ id: 'male', label: 'Masculino', icon: 'male' }, { id: 'female', label: 'Feminino', icon: 'female' }] },
    { id: 'experience', field: 'experience', label: 'EXPERIÊNCIA', subtitle: 'Já treinou antes?', type: 'single_select', options: [{ id: 'none', label: 'Nunca treinei' }, { id: 'beginner', label: 'Menos de 1 ano' }, { id: 'intermediate', label: '1-3 anos' }, { id: 'advanced', label: 'Mais de 3 anos' }] },
    { id: 'training_style', field: 'training_style', label: 'ESTILO DE TREINO', type: 'single_select', options: [{ id: 'solo', label: 'Sozinho', icon: 'person' }, { id: 'partner', label: 'Com amigo', icon: 'people' }, { id: 'coach', label: 'Com personal', icon: 'fitness' }, { id: 'class', label: 'Em aula', icon: 'people' }] },
  ],
  nextStep: 'body',
  phase: 1,
};

// ═══════════════════════════════════════════
// ETAPA 3: CORPO (was: body + injuries + devices)
// ═══════════════════════════════════════════

export const BODY_STEP = {
  id: 'body',
  type: 'multi_section',
  title: 'SEU CORPO',
  subtitle: 'Vamos personalizar exercícios para sua condição',
  sections: [
    { id: 'weight', field: 'weight', label: 'PESO', type: 'number_input', unit: 'kg', min: 30, max: 250, defaultValue: 70, validation: { required: true, min: 30, max: 250 } },
    { id: 'height', field: 'height', label: 'ALTURA', type: 'number_input', unit: 'cm', min: 100, max: 250, defaultValue: 170, validation: { required: true, min: 100, max: 250 } },
    { id: 'injuries', field: 'injuries', label: 'LIMITAÇÕES', subtitle: 'Alguma dor ou limitação?', type: 'injury_selector', hasDescription: true, hasSeverity: true },
    { id: 'preferred_muscles', field: 'preferred_muscles', label: 'MÚSCULOS PREFERIDOS', subtitle: 'Treinamos o que você gosta', type: 'multi_select_pills', options: [{ id: 'chest', label: 'Peito' }, { id: 'back', label: 'Costas' }, { id: 'legs', label: 'Pernas' }, { id: 'shoulders', label: 'Ombros' }, { id: 'arms', label: 'Braços' }, { id: 'abs', label: 'Abdômen' }] },
  ],
  nextStep: 'routine',
  phase: 2,
};

// ═══════════════════════════════════════════
// ETAPA 4: ROTINA (was: lifestyle + workout type + notifications)
// ═══════════════════════════════════════════

export const ROUTINE_STEP = {
  id: 'routine',
  type: 'multi_section',
  title: 'SUA ROTINA',
  subtitle: 'Como você vive impacta como treina',
  sections: [
    { id: 'preferred_time', field: 'preferred_time', label: 'HORÁRIO PREFERIDO', type: 'single_select', options: [{ id: 'morning', label: 'Manhã', icon: 'sunny' }, { id: 'afternoon', label: 'Tarde', icon: 'partly-sunny' }, { id: 'night', label: 'Noite', icon: 'moon' }] },
    { id: 'days_per_week', field: 'days_per_week', label: 'DIAS POR SEMANA', type: 'single_select', options: [{ id: '2', label: '2 dias' }, { id: '3', label: '3 dias' }, { id: '4', label: '4 dias' }, { id: '5', label: '5 dias' }, { id: '6', label: '6 dias' }] },
    { id: 'stress_sleep', field: 'stress_sleep', label: 'SONO/ESTRESSE', subtitle: 'Impacta volume do treino', type: 'single_select', options: [{ id: 'great', label: 'Ótimo' }, { id: 'good', label: 'Bom' }, { id: 'regular', label: 'Regular' }, { id: 'bad', label: 'Ruim' }] },
    { id: 'dietary_restrictions', field: 'dietary_restrictions', label: 'ALIMENTAÇÃO', type: 'single_select', options: [{ id: 'none', label: 'Nenhuma' }, { id: 'vegetarian', label: 'Vegetariano' }, { id: 'vegan', label: 'Vegano' }, { id: 'lactose', label: 'Sem lactose' }, { id: 'gluten', label: 'Sem glúten' }] },
  ],
  nextStep: 'notifications',
  phase: 2,
};

// ═══════════════════════════════════════════
// ETAPA 5: NOTIFICAÇÕES + RESUMO (was: notifications + summary)
// ═══════════════════════════════════════════

export const NOTIFICATIONS_STEP = {
  id: 'notifications',
  type: 'toggles',
  title: 'NOTIFICAÇÕES',
  subtitle: 'Como quer receber lembretes?',
  channels: [
    { id: 'push', label: 'Push', icon: 'phone-portrait', defaultOn: true },
    { id: 'email', label: 'E-mail', icon: 'mail', defaultOn: true },
  ],
  types: [
    { id: 'workout_reminder', label: 'Treino', icon: 'barbell', defaultOn: true },
    { id: 'hydration', label: 'Água', icon: 'water', defaultOn: true },
    { id: 'meal_plan', label: 'Comida', icon: 'restaurant', defaultOn: true },
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
