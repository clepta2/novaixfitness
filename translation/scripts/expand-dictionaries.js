/**
 * Script para expandir dicionários com mais entradas
 * Adiciona vocabulário adicional por categorias
 */

const fs = require('fs');
const path = require('path');

// Vocabulário expandido - categorias adicionais
const EXPANDED_VOCABULARY = {
  // Sentimentos e emoções (expandido)
  'saudade': { en: 'longing', es: 'nostalgia' },
  'orgulho': { en: 'pride', es: 'orgullo' },
  'vergonha': { en: 'shame', es: 'vergüenza' },
  'culpa': { en: 'guilt', es: 'culpa' },
  'inveja': { en: 'envy', es: 'envidia' },
  'ciúme': { en: 'jealousy', es: 'celos' },
  'empatia': { en: 'empathy', es: 'empatía' },
  'compaixão': { en: 'compassion', es: 'compasión' },
  'gratidão': { en: 'gratitude', es: 'gratitud' },
  'humildade': { en: 'humility', es: 'humildad' },
  'paciência': { en: 'patience', es: 'paciencia' },
  'tolerância': { en: 'tolerance', es: 'tolerancia' },
  'resiliência': { en: 'resilience', es: 'resiliencia' },
  'determinação': { en: 'determination', es: 'determinación' },
  'disciplina': { en: 'discipline', es: 'disciplina' },
  'foco': { en: 'focus', es: 'enfoque' },
  'concentração': { en: 'concentration', es: 'concentración' },
  'motivação': { en: 'motivation', es: 'motivación' },
  'inspiração': { en: 'inspiration', es: 'inspiración' },
  'criatividade': { en: 'creativity', es: 'creatividad' },
  'imaginação': { en: 'imagination', es: 'imaginación' },
  'intuição': { en: 'intuition', es: 'intuición' },
  'percepção': { en: 'perception', es: 'percepción' },
  'consciência': { en: 'consciousness', es: 'conciencia' },
  'autoestima': { en: 'self-esteem', es: 'autoestima' },
  'confiança': { en: 'confidence', es: 'confianza' },
  'autoconfiança': { en: 'self-confidence', es: 'autoconfianza' },
  'autocontrole': { en: 'self-control', es: 'autocontrol' },
  'autodisciplina': { en: 'self-discipline', es: 'autodisciplina' },
  'autodesenvolvimento': { en: 'self-development', es: 'autodesarrollo' },
  'autoconhecimento': { en: 'self-knowledge', es: 'autoconocimiento' },
  'autocuidado': { en: 'self-care', es: 'autocuidado' },
  'autocadastro': { en: 'self-enrollment', es: 'autoinscripción' },
  'autoavaliação': { en: 'self-assessment', es: 'autoevaluación' },
  'autocrítica': { en: 'self-criticism', es: 'autocrítica' },
  'autoestima': { en: 'self-esteem', es: 'autoestima' },
  'autoconfiança': { en: 'self-confidence', es: 'autoconfianza' },
  'autocontrole': { en: 'self-control', es: 'autocontrol' },
  'autodisciplina': { en: 'self-discipline', es: 'autodisciplina' },
  'autodesenvolvimento': { en: 'self-development', es: 'autodesarrollo' },
  'autoconhecimento': { en: 'self-knowledge', es: 'autoconocimiento' },
  'autocuidado': { en: 'self-care', es: 'autocuidado' },
  'autocadastro': { en: 'self-enrollment', es: 'autoinscripción' },
  'autoavaliação': { en: 'self-assessment', es: 'autoevaluación' },
  'autocrítica': { en: 'self-criticism', es: 'autocrítica' },
  
  // Ações físicas (expandido)
  'correr': { en: 'to run', es: 'correr' },
  'caminhar': { en: 'to walk', es: 'caminar' },
  'pular': { en: 'to jump', es: 'saltar' },
  'sentar': { en: 'to sit', es: 'sentarse' },
  'levantar': { en: 'to lift', es: 'levantar' },
  'empurrar': { en: 'to push', es: 'empujar' },
  'puxar': { en: 'to pull', es: 'tirar' },
  'esticar': { en: 'to stretch', es: 'estirar' },
  'girar': { en: 'to turn', es: 'girar' },
  'balançar': { en: 'to swing', es: 'balancear' },
  'agachar': { en: 'to squat', es: 'agacharse' },
  'iniciar': { en: 'to start', es: 'iniciar' },
  'parar': { en: 'to stop', es: 'parar' },
  'continuar': { en: 'to continue', es: 'continuar' },
  'acelerar': { en: 'to accelerate', es: 'acelerar' },
  'frear': { en: 'to brake', es: 'frenar' },
  'descansar': { en: 'to rest', es: 'descansar' },
  'recuperar': { en: 'to recover', es: 'recuperar' },
  'aquecer': { en: 'to warm up', es: 'calentar' },
  'esfriar': { en: 'to cool down', es: 'enfriar' },
  'alongar': { en: 'to stretch', es: 'estirar' },
  'flexionar': { en: 'to flex', es: 'flexionar' },
  'extender': { en: 'to extend', es: 'extender' },
  'rotacionar': { en: 'to rotate', es: 'rotar' },
  'abduzir': { en: 'to abduct', es: 'abducir' },
  'aduzir': { en: 'to adduct', es: 'aducir' },
  'flexionar': { en: 'to flex', es: 'flexionar' },
  'esticar': { en: 'to extend', es: 'extender' },
  'rotacionar': { en: 'to rotate', es: 'rotar' },
  'abduzir': { en: 'to abduct', es: 'abducir' },
  'aduzir': { en: 'to adduct', es: 'aducir' },
  
  // Exercícios (expandido)
  'supino': { en: 'bench press', es: 'press de banca' },
  'remada': { en: 'row', es: 'remo' },
  'desenvolvimento': { en: 'shoulder press', es: 'press de hombros' },
  'tríceps': { en: 'triceps', es: 'tríceps' },
  'bíceps': { en: 'biceps', es: 'bíceps' },
  'ante-braço': { en: 'forearm', es: 'antebrazo' },
  'panturrilha': { en: 'calf', es: 'pantorrilla' },
  'coxa': { en: 'thigh', es: 'muslo' },
  'posteriores': { en: 'hamstrings', es: 'isquiotibiales' },
  'glúteos': { en: 'glutes', es: 'glúteos' },
  'lombar': { en: 'lower back', es: 'lumbar' },
  'trapézio': { en: 'traps', es: 'trapecios' },
  'deltóides': { en: 'deltoids', es: 'deltoides' },
  'peitoral': { en: 'pectorals', es: 'pectorales' },
  'grande dorsal': { en: 'lats', es: 'dorsal ancho' },
  'serrátil': { en: 'serratus', es: 'serrato' },
  'rotadores': { en: 'rotators', es: 'rotadores' },
  'abdominais': { en: 'abdominals', es: 'abdominales' },
  'oblíquos': { en: 'obliques', es: 'oblicuos' },
  'intercostais': { en: 'intercostals', es: 'intercostales' },
  'diafragma': { en: 'diaphragm', es: 'diafragma' },
  
  // Equipamentos
  'halteres': { en: 'dumbbells', es: 'mancuernas' },
  'barra': { en: 'barbell', es: 'barra' },
  'anilhas': { en: 'plates', es: 'discos' },
  'máquina': { en: 'machine', es: 'máquina' },
  'cabo': { en: 'cable', es: 'cable' },
  'elástico': { en: 'resistance band', es: 'banda elástica' },
  'bola': { en: 'ball', es: 'pelota' },
  'colchonete': { en: 'mat', es: 'colchoneta' },
  'step': { en: 'step', es: 'step' },
  'kettlebell': { en: 'kettlebell', es: 'kettlebell' },
  'TRX': { en: 'TRX', es: 'TRX' },
  'pulley': { en: 'pulley', es: 'polea' },
  'leg press': { en: 'leg press', es: 'prensa de piernas' },
  'cadeira extensora': { en: 'leg extension', es: 'extensión de piernas' },
  'cadeira flexora': { en: 'leg curl', es: 'curl de piernas' },
  'elevação lateral': { en: 'lateral raise', es: 'elevación lateral' },
  'rosca direta': { en: 'bicep curl', es: 'curl de bíceps' },
  'rosca martelo': { en: 'hammer curl', es: 'curl martillo' },
  'tríceps testa': { en: 'skull crusher', es: 'extensión de tríceps' },
  'tríceps pulley': { en: 'tricep pushdown', es: 'pushdown de tríceps' },
  'face pull': { en: 'face pull', es: 'face pull' },
  'crucifixo': { en: 'fly', es: 'apertado' },
  'crossover': { en: 'crossover', es: 'crossover' },
  'puxada frontal': { en: 'lat pulldown', es: 'jalón frontal' },
  'puxada aberta': { en: 'wide grip pulldown', es: 'jalón agarre ancho' },
  'puxada fechada': { en: 'close grip pulldown', es: 'jalón agarre cerrado' },
  'remada curvada': { en: 'bent over row', es: 'remo inclinado' },
  'remada unilateral': { en: 'one arm row', es: 'remo a un brazo' },
  'remada cavalinho': { en: 't-bar row', es: 'remo en T' },
  'leg press 45': { en: '45 degree leg press', es: 'prensa 45 grados' },
  'hack squat': { en: 'hack squat', es: 'sentadilla hack' },
  'calf raise': { en: 'calf raise', es: 'elevación de pantorrillas' },
  'stiff': { en: 'stiff leg deadlift', es: 'peso muerto piernas rígidas' },
  'terra': { en: 'deadlift', es: 'peso muerto' },
  'agachamento livre': { en: 'barbell squat', es: 'sentadilla con barra' },
  'agachamento frontal': { en: 'front squat', es: 'sentadilla frontal' },
  'agachamento bulgaro': { en: 'bulgarian split squat', es: 'sentadilla búlgara' },
  'agachamento sumo': { en: 'sumo squat', es: 'sentadilla sumo' },
  'agachamento WALL': { en: 'wall sit', es: 'sentadilla en pared' },
  'agachamento com salto': { en: 'jump squat', es: 'sentadilla con salto' },
  'agachamento com halteres': { en: 'dumbbell squat', es: 'sentadilla con mancuernas' },
  'agachamento com barra': { en: 'barbell squat', es: 'sentadilla con barra' },
  'agachamento com peso corporal': { en: 'bodyweight squat', es: 'sentadilla con peso corporal' },
  'agachamento com elástico': { en: 'resistance band squat', es: 'sentadilla con banda elástica' },
  'agachamento com kettlebell': { en: 'kettlebell squat', es: 'sentadilla con kettlebell' },
  'agachamento com halteres': { en: 'dumbbell squat', es: 'sentadilla con mancuernas' },
  'agachamento com barra': { en: 'barbell squat', es: 'sentadilla con barra' },
  'agachamento com peso corporal': { en: 'bodyweight squat', es: 'sentadilla con peso corporal' },
  'agachamento com elástico': { en: 'resistance band squat', es: 'sentadilla con banda elástica' },
  'agachamento com kettlebell': { en: 'kettlebell squat', es: 'sentadilla con kettlebell' },
  
  // Anatomia (expandido)
  'músculo': { en: 'muscle', es: 'músculo' },
  'tendão': { en: 'tendon', es: 'tendón' },
  'ligamento': { en: 'ligament', es: 'ligamento' },
  'cartilagem': { en: 'cartilage', es: 'cartílago' },
  'osso': { en: 'bone', es: 'hueso' },
  'articulação': { en: 'joint', es: 'articulación' },
  'coluna vertebral': { en: 'spine', es: 'columna vertebral' },
  'fêmur': { en: 'femur', es: 'fémur' },
  'tíbia': { en: 'tibia', es: 'tibia' },
  'fíbula': { en: 'fibula', es: 'peroné' },
  'rádio': { en: 'radius', es: 'radio' },
  'ulna': { en: 'ulna', es: 'cúbito' },
  'úmero': { en: 'humerus', es: 'húmero' },
  'escápula': { en: 'scapula', es: 'escápula' },
  'clavícula': { en: 'clavicle', es: 'clavícula' },
  'esterno': { en: 'sternum', es: 'esternón' },
  'costelas': { en: 'ribs', es: 'costillas' },
  'bacia': { en: 'pelvis', es: 'pelvis' },
  'ossos do quadril': { en: 'hip bones', es: 'huesos de la cadera' },
  
  // Fisiologia
  'metabolismo': { en: 'metabolism', es: 'metabolismo' },
  'catabolismo': { en: 'catabolism', es: 'catabolismo' },
  'anabolismo': { en: 'anabolism', es: 'anabolismo' },
  'frequência cardíaca': { en: 'heart rate', es: 'frecuencia cardíaca' },
  'pressão arterial': { en: 'blood pressure', es: 'presión arterial' },
  'saturação de oxigênio': { en: 'oxygen saturation', es: 'saturación de oxígeno' },
  'respiração': { en: 'breathing', es: 'respiración' },
  'ventilação': { en: 'ventilation', es: 'ventilación' },
  'oxigenação': { en: 'oxygenation', es: 'oxigenación' },
  'circulação': { en: 'circulation', es: 'circulación' },
  'digestão': { en: 'digestion', es: 'digestión' },
  'absorção': { en: 'absorption', es: 'absorción' },
  'eliminação': { en: 'elimination', es: 'eliminación' },
  'homeostase': { en: 'homeostasis', es: 'homeostasis' },
  'termorregulação': { en: 'thermoregulation', es: 'termorregulación' },
  'hidratação': { en: 'hydration', es: 'hidratación' },
  'nutrição': { en: 'nutrition', es: 'nutrición' },
  'suplementação': { en: 'supplementation', es: 'suplementación' },
  'análise corporal': { en: 'body analysis', es: 'análisis corporal' },
  'composição corporal': { en: 'body composition', es: 'composición corporal' },
  'massa muscular': { en: 'muscle mass', es: 'masa muscular' },
  'gordura corporal': { en: 'body fat', es: 'grasa corporal' },
  'massa magra': { en: 'lean mass', es: 'masa magra' },
  'massa gorda': { en: 'fat mass', es: 'masa grasa' },
  'água corporal': { en: 'body water', es: 'agua corporal' },
  'ossalidade': { en: 'bone mass', es: 'masa ósea' },
  'metabolismo basal': { en: 'basal metabolism', es: 'metabolismo basal' },
  'taxa metabólica': { en: 'metabolic rate', es: 'tasa metabólica' },
  'calorias diárias': { en: 'daily calories', es: 'calorías diarias' },
  'calorias ingeridas': { en: 'ingested calories', es: 'calorías ingeridas' },
  'calorias queimadas': { en: 'burned calories', es: 'calorías quemadas' },
  'saldo calórico': { en: 'caloric balance', es: 'balance calórico' },
  'superávit calórico': { en: 'caloric surplus', es: 'superávit calórico' },
  'déficit calórico': { en: 'caloric deficit', es: 'déficit calórico' },
  
  // Treino (expandido)
  'série': { en: 'set', es: 'serie' },
  'repetição': { en: 'repetition', es: 'repetición' },
  'intervalo': { en: 'interval', es: 'intervalo' },
  'descanso': { en: 'rest', es: 'descanso' },
  'carga': { en: 'load', es: 'carga' },
  'intensidade': { en: 'intensity', es: 'intensidad' },
  'volume': { en: 'volume', es: 'volumen' },
  'frequência': { en: 'frequency', es: 'frecuencia' },
  'periodização': { en: 'periodization', es: 'periodización' },
  'progressão': { en: 'progression', es: 'progresión' },
  'sobrecarga': { en: 'overload', es: 'sobrecarga' },
  'estímulo': { en: 'stimulus', es: 'estímulo' },
  'adaptação': { en: 'adaptation', es: 'adaptación' },
  'recuperação': { en: 'recovery', es: 'recuperación' },
  'fadiga': { en: 'fatigue', es: 'fatiga' },
  'exaustão': { en: 'exhaustion', es: 'exhaustión' },
  'musculação': { en: 'bodybuilding', es: 'culturismo' },
  'hipertrofia': { en: 'hypertrophy', es: 'hipertrofia' },
  'força': { en: 'strength', es: 'fuerza' },
  'resistência': { en: 'endurance', es: 'resistencia' },
  'potência': { en: 'power', es: 'potencia' },
  'velocidade': { en: 'speed', es: 'velocidad' },
  'agilidade': { en: 'agility', es: 'agilidad' },
  'coordenação': { en: 'coordination', es: 'coordinación' },
  'equilíbrio': { en: 'balance', es: 'equilibrio' },
  'flexibilidade': { en: 'flexibility', es: 'flexibilidad' },
  'mobilidade': { en: 'mobility', es: 'movilidad' },
  'estabilidade': { en: 'stability', es: 'estabilidad' },
  'controle motor': { en: 'motor control', es: 'control motor' },
  'propriocepção': { en: 'proprioception', es: 'propiocepción' },
  'neuromuscular': { en: 'neuromuscular', es: 'neuromuscular' },
  'biomecânica': { en: 'biomechanics', es: 'biomecánica' },
  'cinemática': { en: 'kinematics', es: 'cinemática' },
  'cinética': { en: 'kinetics', es: 'cinética' },
  'dinâmica': { en: 'dynamics', es: 'dinámica' },
  'estática': { en: 'statics', es: 'estática' },
  'ergometria': { en: 'ergometry', es: 'ergometría' },
  'ergonomia': { en: 'ergonomics', es: 'ergonomía' },
  'avaliação física': { en: 'physical assessment', es: 'evaluación física' },
  'teste ergométrico': { en: 'ergometric test', es: 'teste ergométrico' },
  'teste de esforço': { en: 'stress test', es: 'teste de esfuerzo' },
  'prova de esforço': { en: 'exercise test', es: 'prueba de esfuerzo' },
  'ergoespirometria': { en: 'ergospirometry', es: 'ergoespirometría' },
  ' VO2 máximo': { en: 'VO2 max', es: 'VO2 máximo' },
  'limiar anaeróbico': { en: 'anaerobic threshold', es: 'umbral anaeróbico' },
  'limiar ventilatório': { en: 'ventilatory threshold', es: 'umbral ventilatorio' },
  'zona de treino': { en: 'training zone', es: 'zona de entrenamiento' },
  'zona cardíaca': { en: 'heart rate zone', es: 'zona cardíaca' },
  'zona aeróbica': { en: 'aerobic zone', es: 'zona aeróbica' },
  'zona anaeróbica': { en: 'anaerobic zone', es: 'zona anaeróbica' },
  'zona de fartlek': { en: 'fartlek zone', es: 'zona de fartlek' },
  'zona de intervalo': { en: 'interval zone', es: 'zona de intervalo' },
  'zona de resistência': { en: 'endurance zone', es: 'zona de resistencia' },
  'zona de força': { en: 'strength zone', es: 'zona de fuerza' },
  'zona de potência': { en: 'power zone', es: 'zona de potencia' },
  'zona de velocidade': { en: 'speed zone', es: 'zona de velocidad' },
  'zona de recuperação': { en: 'recovery zone', es: 'zona de recuperación' },
};

// Carregar dicionário existente
const dictionaryPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionarypt.ts');
const content = fs.readFileSync(dictionaryPath, 'utf-8');

// Extrair objeto existente usando regex mais robusto
const match = content.match(/export const PT_DICTIONARY[^=]*=\s*(\{[\s\S]*?\});/);
if (!match) {
  console.error('Não foi possível extrair o dicionário existente');
  process.exit(1);
}

let existingDictionary;
try {
  // Substituir aspas simples por duplas para JSON.parse
  const jsonStr = match[1].replace(/'/g, '"');
  existingDictionary = JSON.parse(jsonStr);
} catch (e) {
  console.error('Erro ao parsear dicionário:', e);
  // Criar dicionário vazio se falhar
  existingDictionary = {};
}

// Adicionar vocabulário expandido
const expandedCount = Object.keys(EXPANDED_VOCABULARY).length;
console.log(`Adicionando ${expandedCount} entradas expandidas...`);

for (const [key, value] of Object.entries(EXPANDED_VOCABULARY)) {
  existingDictionary[key] = value;
}

const totalEntries = Object.keys(existingDictionary).length;
console.log(`Total de entradas: ${totalEntries}`);

// Salvar dicionário atualizado
const outputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionarypt.ts');
const newContent = `// dictionarypt.ts - Dicionário PT com ${totalEntries} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const PT_DICTIONARY: Record<string, { en: string; es: string }> = ${JSON.stringify(existingDictionary, null, 2)};
`;

fs.writeFileSync(outputPath, newContent, 'utf-8');
console.log(`Dicionário PT atualizado em: ${outputPath}`);

// Gerar dicionário EN atualizado
const enDictionary = {};
for (const [pt, translations] of Object.entries(existingDictionary)) {
  enDictionary[translations.en] = { pt, es: translations.es };
}

const enOutputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionaryen.ts');
const enContent = `// dictionaryen.ts - Dicionário EN com ${Object.keys(enDictionary).length} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const EN_DICTIONARY: Record<string, { pt: string; es: string }> = ${JSON.stringify(enDictionary, null, 2)};
`;

fs.writeFileSync(enOutputPath, enContent, 'utf-8');
console.log(`Dicionário EN atualizado em: ${enOutputPath}`);

// Gerar dicionário ES atualizado
const esDictionary = {};
for (const [pt, translations] of Object.entries(existingDictionary)) {
  esDictionary[translations.es] = { pt, en: translations.en };
}

const esOutputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionaryes.ts');
const esContent = `// dictionaryes.ts - Dicionário ES com ${Object.keys(esDictionary).length} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const ES_DICTIONARY: Record<string, { pt: string; en: string }> = ${JSON.stringify(esDictionary, null, 2)};
`;

fs.writeFileSync(esOutputPath, esContent, 'utf-8');
console.log(`Dicionário ES atualizado em: ${esOutputPath}`);

console.log('Expansão concluída!');
