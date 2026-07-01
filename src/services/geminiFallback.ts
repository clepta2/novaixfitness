export function generateFallbackResponse(message, context) {
  const msgLower = message.toLowerCase();
  const goal = context.goal?.toLowerCase() || '';
  const weight = context.weight || 70;
  const height = context.height || 170;
  const age = context.age || 25;
  const gender = context.gender || 'M';

  if (msgLower.includes('treino') || msgLower.includes('exercicio') || msgLower.includes('treinar')) {
    if (goal.includes('hipertrofia') || goal.includes('massa')) {
      return `Para hipertrofia com ${context.level || 'nivel intermediario'}:\n\nFrequencia: 4-5x/semana\nDivisao recomendada: A (Peito/Triceps), B (Costas/Biceps), C (Pernas), D (Ombros/Abdomen)\n\nProgressao: aumente carga quando conseguir 12 reps com boa forma. Registre tudo no app!`;
    }
    if (goal.includes('emagrec') || goal.includes('perder peso')) {
      const calCardio = Math.round(weight * 0.8 * 30);
      return `Para emagrecimento:\n\nMusculacao 3-4x/semana + HIIT 2-3x/semana\nHIIT queima ~${calCardio} kcal em 30min\n\nDica: foque em exercicios compostos (agachamento, supino, remada) para maxima queima calorica.`;
    }
    if (goal.includes('forca') || goal.includes('condicionamento')) {
      return `Para forca e condicionamento:\n\nCombinacao ideal: musculacao pesada (3-5x repeticoes) + cardio intervalado\nExercicios: agachamento, levantamento terra, supino, barra\nProgressao: aumente carga ou reduza descanso entre series.`;
    }
    return `Para seu nivel (${context.level || 'intermediario'}) e objetivo (${goal || 'evoluir'}):\n\nTreine 3-4x/semana misturando forca e cardio. Registre suas cargas no app para acompanhar a evolucao. Consistencia e a chave!`;
  }

  if (msgLower.includes('dieta') || msgLower.includes('comer') || msgLower.includes('nutricao') || msgLower.includes('proteina') || msgLower.includes('caloria')) {
    const bmr = gender === 'M' ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const calories = Math.round(bmr * 1.55);
    const protein = Math.round(weight * 1.8);
    return `Seu plano nutricional personalizado:\n\nCalorias alvo: ~${calories} kcal/dia\nProteina: ~${protein}g/dia (${Math.round(protein / 4)}g por refeicao em 4 refeicoes)\nCarboidratos: ~${Math.round(calories * 0.45 / 4)}g/dia\nGorduras: ~${Math.round(calories * 0.25 / 9)}g/dia\n\nDica: distribua as proteinas ao longo do dia para melhor absorcao.`;
  }

  if (msgLower.includes('suplemento') || msgLower.includes('whey') || msgLower.includes('creatina') || msgLower.includes('pre-treino')) {
    return `Suplementação recomendada:\n\n1. Whey Protein: 30g pós-treino (25g proteína)\n2. Creatina: 5g/dia, todos os dias\n3. Omega-3: 2g/dia para recuperação\n4. Cafeína: 200mg 30min antes do treino (opcional)\n\nLembre: suplementos complementam, não substituem alimentação.`;
  }

  if (msgLower.includes('agachamento') || msgLower.includes('agachar')) {
    return `Agachamento correto:\n\n1. Pés na largura dos ombros, pontas levemente pra fora\n2. Descenda como se fosse sentar, até coxas paralelas ao chão\n3. Mantenha peito aberto e coluna reta\n4. Empurre o chão com os pés ao subir\n\nErros comuns: joelhos pra dentro, corpo inclinado, heels levantados.`;
  }

  if (msgLower.includes('supino')) {
    return `Supino correto:\n\n1. Deitado no banco, pés firmes no chão\n2. Pegada na largura dos ombros (ou um pouco mais)\n3. Desça o haltere até o peito, cotovelos a 45 graus\n4. Suba controlado, contraindo o peito\n\nDica: não trave os cotovelos no topo.`;
  }

  if (msgLower.includes('lesao') || msgLower.includes('dor') || msgLower.includes('machucado')) {
    return `IMPORTANTE: Em caso de dor persistente, consulte um profissional.\n\nEnquanto isso:\n- Pare o exercício que causa dor\n- Aplique gelo por 15min a cada 2h\n- Alongue suavemente a área afetada\n- Retorne gradualmente aos treinos\n\nNão ignore dores agudas. Prevenção > Tratamento.`;
  }

  if (msgLower.includes('cardio') || msgLower.includes('correr') || msgLower.includes('corrida')) {
    const calRun = Math.round(weight * 1.0 * 30);
    return `Cardio recomendado:\n\nPara iniciantes: caminhada rápida 30min\nIntermediário: corrida intervalada 25min (~${calRun} kcal)\nAvançado: HIIT 20min ou corrida 40min\n\nMeta: 150min/semana de atividade aeróbica moderada.`;
  }

  if (msgLower.includes('descanso') || msgLower.includes('dormir') || msgLower.includes('sono') || msgLower.includes('recuperacao')) {
    return `Sono e recuperação ótima:\n\n1. Durma 7-9h por noite (horário fixo)\n2. Evite telas 1h antes de dormir\n3. Quarto escuro e fresco (18-20C)\n4. Cafeína apenas até 14h\n5. Treine pelo menos 3h antes de dormir\n\nDias de descanso: respeite! Músculos crescem durante o repouso.`;
  }

  if (msgLower.includes('alongamento') || msgLower.includes('flexibilidade') || msgLower.includes('mobilidade')) {
    return `Rotina de mobilidade (10-15min):\n\n1. Rotação de ombros: 10x cada lado\n2. Quadríceps no chão: 30s cada lado\n3. Estocada com rotação: 10x cada lado\n4. Prancha: 3x 30s\n5. Cobra: 3x 15s\n\nFaça pós-treino ou em dias de descanso.`;
  }

  if (msgLower.includes('ola') || msgLower.includes('bom dia') || msgLower.includes('boa noite') || msgLower.includes('oi')) {
    const hour = new Date().getHours();
    let greeting = 'Olá';
    if (hour >= 6 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';
    return `${greeting}! 😊\n\nSou seu Coach IA do NOVAIX. Vejo que você está com objetivo de "${goal || 'evoluir no físico'}" e nível "${context.level || 'intermediário'}".\n\nComo posso ajudar hoje? Posso falar sobre treino, nutrição, suplementação ou recuperação.`;
  }

  if (msgLower.includes('obrigad') || msgLower.includes('valeu') || msgLower.includes('thanks')) {
    return `Por nada! 😊 Estou aqui sempre que precisar. Bora treinar! 💪`;
  }

  const responses = [
    `Entendi! Baseado no seu perfil (${context.level || 'intermediário'}, ${goal || 'evoluir'}), posso ajudar com:\n\n- Treinos específicos\n- Plano nutricional\n- Suplementação\n- Recuperação\n\nSobre o que quer saber?`,
    `Boa pergunta! Analisando seus dados (${weight}kg, ${context.height || 170}cm):\n\nMe diga mais detalhes para eu te dar uma dica mais personalizada. Treino, dieta ou recuperação?`,
    `Vou te ajudar com isso! Para uma resposta mais precisa, me conte:\n- Qual seu objetivo atual?\n- Há quanto tempo treina?\n- Tem alguma restrição alimentar?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
