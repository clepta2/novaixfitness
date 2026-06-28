// src/data/ageRanges.js
// Faixas etárias configuráveis

export const AGE_RANGES = [
  { id: '10-17', label: '10-17', description: 'Adolescente', icon: 'school', color: '#6366F1', warnings: ['Evitar exercícios com carga pesada', 'Foco em forma e coordenação'] },
  { id: '18-25', label: '18-25', description: 'Jovem adulto', icon: 'person', color: '#00E676', warnings: [] },
  { id: '26-35', label: '26-35', description: 'Adulto jovem', icon: 'man', color: '#3B82F6', warnings: [] },
  { id: '36-45', label: '36-45', description: 'Adulto', icon: 'man', color: '#FF9800', warnings: ['Aquecimento mais longo'] },
  { id: '46-55', label: '46-55', description: 'Meia-idade', icon: 'man', color: '#FF5722', warnings: ['Evitar impacto', 'Mais alongamento'] },
  { id: '56-65', label: '56-65', description: 'Senior', icon: 'man', color: '#9C27B0', warnings: ['Exercícios de baixo impacto', 'Mais descanso'] },
  { id: '66-100', label: '66+', description: 'Idoso', icon: 'man', color: '#795548', warnings: ['Apenas exercícios leves', 'Acompanhamento médico'] },
];

export function getAgeRange(age) {
  if (age < 18) return AGE_RANGES[0];
  if (age < 26) return AGE_RANGES[1];
  if (age < 36) return AGE_RANGES[2];
  if (age < 46) return AGE_RANGES[3];
  if (age < 56) return AGE_RANGES[4];
  if (age < 66) return AGE_RANGES[5];
  return AGE_RANGES[6];
}

export function getAgeWarnings(age) {
  const range = getAgeRange(age);
  return range.warnings;
}
