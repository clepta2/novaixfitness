// src/data/faqItems.ts
// Perguntas frequentes - NOVAIX FITNESS

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  { id: '1', question: 'Como funciona o plano de treino?', answer: 'Após completar o onboarding, o app gera um plano personalizado baseado no seu nível, objetivo e disponibilidade. O plano se adapta automaticamente conforme você evolui.' },
  { id: '2', question: 'Posso trocar de plano?', answer: 'Sim! Acesse Configurações > Assinatura para alterar seu plano a qualquer momento.' },
  { id: '3', question: 'Como funciona o cronômetro?', answer: 'O timer regressivo: 45 segundos de exercício seguidos de 15 segundos de descanso.' },
  { id: '4', question: 'Os vídeos funcionam offline?', answer: 'Não no momento. Os vídeos são carregados do YouTube e precisam de conexão.' },
  { id: '5', question: 'Como cancelo minha assinatura?', answer: 'Acesse Configurações > Assinatura > Cancelar. Acesso mantido até o fim do período.' },
  { id: '6', question: 'Posso usar em mais de um dispositivo?', answer: 'Sim! Basta fazer login com mesmo e-mail e senha.' },
];
