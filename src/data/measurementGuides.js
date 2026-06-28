// src/data/measurementGuides.js
// Guias de medição - DATA DRIVEN

export const MEASUREMENT_GUIDES = {
  chest: {
    title: 'MEDIR O PEITO',
    steps: ['Fique em pé, relaxado', 'Passe a fita ao redor do peito', 'Posicione na parte mais larga', 'Mantenha paralela ao chão', 'Meça na expiração'],
    correct: 'Fita firme, sem apertar',
    incorrect: 'Não puxe nem deixe frouxa',
    tip: 'Se tiver dúvida, meça 2 vezes e tire a média',
  },
  waist: {
    title: 'MEDIR A CINTURA',
    steps: ['Fique em pé, relaxado', 'Passe a fita ao redor da cintura', 'Posicione na parte mais estreita', 'Respire normalmente', 'Meça na expiração'],
    correct: 'Fita firme, sem apertar',
    incorrect: 'Não puxe para dentro',
    tip: 'A cintura fica entre as costelas e o quadril',
  },
  hip: {
    title: 'MEDIR O QUADRIL',
    steps: ['Fique em pé, pés juntos', 'Passe a fita ao redor do quadril', 'Posicione na parte mais larga', 'Mantenha a fita horizontal', 'Meça em pé, não sentado'],
    correct: 'Fita firme, sem apertar',
    incorrect: 'Não puxe nem deixe frouxa',
    tip: 'O quadril fica na parte mais larga do corpo',
  },
};

export const MEASUREMENT_TIPS = [
  'Meça sempre no mesmo horário do dia',
  'Não aperte a fita, apenas encoste no corpo',
  'Se estiver entre dois tamanhos, escolha o maior',
];
