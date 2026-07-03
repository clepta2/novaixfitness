// src/services/waterCalculator.js
// Calculadora de hidratação baseada em IMC e fatores pessoais

export function calculateWater(weight, height, level, ageRange, injuries = []) {
  // Fórmula base: peso × 35ml
  let baseML = weight * 35;
  
  // Ajustar por IMC
  const imc = weight / ((height / 100) ** 2);
  if (imc > 30) baseML *= 1.1;
  else if (imc > 25) baseML *= 1.05;
  else if (imc < 18.5) baseML *= 0.95;
  
  // Ajustar por nível de treino
  const levelFactors = { iniciante: 1.0, basico: 1.05, intermediario: 1.1, 'avançado': 1.2 };
  baseML *= levelFactors[level] || 1.0;
  
  // Ajustar por faixa etária
  const ageFactors = {
    '10-17': 1.0,
    '18-25': 1.0,
    '26-35': 1.0,
    '36-45': 0.98,
    '46-55': 0.95,
    '56-65': 0.92,
    '66-100': 0.90,
  };
  baseML *= ageFactors[ageRange] || 1.0;
  
  // Ajustar por lesões (menos exercício = menos água)
  if (injuries.length > 0) baseML *= 0.95;
  
  // Garantir mínimo de 1500ml e máximo de 5000ml
  baseML = Math.max(1500, Math.min(5000, baseML));
  
  return {
    dailyML: Math.round(baseML),
    glassesPerDay: Math.ceil(baseML / 250),
    imc: imc.toFixed(1),
    imcClassification: getIMCClassification(imc),
  };
}

function getIMCClassification(imc) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25) return 'Normal';
  if (imc < 30) return 'Sobrepeso';
  if (imc < 35) return 'Obesidade I';
  if (imc < 40) return 'Obesidade II';
  return 'Obesidade III';
}

export function generateWaterSchedule(dailyML, preferredTime = 'morning') {
  const glassML = 250;
  const timeMap = { morning: 7, afternoon: 12, night: 18 };
  const startHour = timeMap[preferredTime] || 7;
  const numGlasses = Math.ceil(dailyML / glassML);
  
  if (numGlasses <= 6) {
    return [
      { time: '07:00', amount: glassML, label: 'Ao acordar' },
      { time: '10:00', amount: glassML, label: 'Manhã' },
      { time: '12:00', amount: glassML, label: 'Almoço' },
      { time: '15:00', amount: glassML, label: 'Tarde' },
      { time: '18:00', amount: glassML, label: 'Pré-treino' },
      { time: '20:00', amount: glassML, label: 'Pós-treino' },
    ];
  }
  
  return [
    { time: '06:30', amount: glassML, label: 'Ao acordar' },
    { time: '09:00', amount: glassML, label: 'Manhã' },
    { time: '11:00', amount: glassML, label: 'Pré-treino' },
    { time: '13:00', amount: glassML, label: 'Almoço' },
    { time: '15:00', amount: glassML, label: 'Tarde' },
    { time: '17:00', amount: glassML, label: 'Pré-treino' },
    { time: '19:00', amount: glassML, label: 'Pós-treino' },
    { time: '21:00', amount: glassML, label: 'Noite' },
  ];
}

export function hasTapeMeasure() {
  return true; // Perguntar no onboarding
}


