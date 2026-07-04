/**
 * Script para gerar dicionários FR, DE, IT
 * Fase 2: Adicionar francês, alemão, italiano
 */

const fs = require('fs');
const path = require('path');

// Vocabulário PT → FR, DE, IT
const VOCABULARY_FR = {
  // Corpo humano
  'corpo': 'corps', 'cabeça': 'tête', 'rosto': 'visage', 'olhos': 'yeux',
  'boca': 'bouche', 'nariz': 'nez', 'orelhas': 'oreilles', 'pescoço': 'cou',
  'ombros': 'épaules', 'braços': 'bras', 'mãos': 'mains', 'dedos': 'doigts',
  'peito': 'poitrine', 'costas': 'dos', 'abdomen': 'abdomen', 'quadril': 'hanches',
  'pernas': 'jambes', 'joelhos': 'genoux', 'pés': 'pieds',
  
  // Alimentos
  'arroz': 'riz', 'feijão': 'haricots', 'carne': 'viande', 'frango': 'poulet',
  'peixe': 'poisson', 'ovo': 'œuf', 'leite': 'lait', 'pão': 'pain',
  'queijo': 'fromage', 'fruta': 'fruit', 'legume': 'légume', 'salada': 'salade',
  'água': 'eau', 'café': 'café', 'suco': 'jus',
  
  // Exercícios
  'exercício': 'exercice', 'treino': 'entraînement', 'musculação': 'musculation',
  'cardio': 'cardio', 'alongamento': 'étirement', 'aquecimento': 'échauffement',
  'flexão': 'pompe', 'agachamento': 'squat', 'abdominal': 'crunch', 'prancha': 'planche',
  'corrida': 'course', 'caminhada': 'marche', 'natação': 'natation', 'ciclisme': 'cyclisme',
  'yoga': 'yoga', 'pilates': 'pilates',
  
  // Saúde
  'saúde': 'santé', 'doença': 'maladie', 'remédio': 'médicament', 'vitamina': 'vitamine',
  'proteína': 'protéine', 'carboidrato': 'glucide', 'gordura': 'graisse', 'caloria': 'calorie',
  'dieta': 'régime', 'nutrição': 'nutrition',
  
  // Sentimentos
  'alegria': 'joie', 'tristeza': 'tristesse', 'raiva': 'colère', 'medo': 'peur',
  'surpresa': 'surprise', 'amor': 'amour', 'feliz': 'heureux', 'triste': 'triste',
  'cansado': 'fatigué', 'animado': 'excité',
  
  // Tempo
  'hoje': "aujourd'hui", 'ontem': 'hier', 'amanhã': 'demain', 'agora': 'maintenant',
  'depois': 'après', 'antes': 'avant', 'sempre': 'toujours', 'nunca': 'jamais',
  
  // Lugares
  'casa': 'maison', 'academia': 'salle de sport', 'escola': 'école', 'trabalho': 'travail',
  'parque': 'parc', 'praia': 'plage', 'restaurante': 'restaurant', 'hospital': 'hôpital',
  
  // Cores
  'vermelho': 'rouge', 'azul': 'bleu', 'verde': 'vert', 'amarelo': 'jaune',
  'laranja': 'orange', 'roxo': 'violet', 'rosa': 'rose', 'preto': 'noir',
  'branco': 'blanc', 'marrom': 'marron', 'cinza': 'gris',
  
  // Girias francesas
  'legal': 'génial', 'bacana': 'super', 'massa': 'awesome', 'top': 'top',
  'firme': 'solide', 'tranquilo': 'calme', 'cara': 'mec', 'maluco': 'fou',
};

const VOCABULARY_DE = {
  // Corpo humano
  'corpo': 'Körper', 'cabeça': 'Kopf', 'rosto': 'Gesicht', 'olhos': 'Augen',
  'boca': 'Mund', 'nariz': 'Nase', 'orelhas': 'Ohren', 'pescoço': 'Nacken',
  'ombros': 'Schultern', 'braços': 'Arme', 'mãos': 'Hände', 'dedos': 'Finger',
  'peito': 'Brust', 'costas': 'Rücken', 'abdomen': 'Bauch', 'quadril': 'Hüfte',
  'pernas': 'Beine', 'joelhos': 'Knie', 'pés': 'Füße',
  
  // Alimentos
  'arroz': 'Reis', 'feijão': 'Bohnen', 'carne': 'Fleisch', 'frango': 'Hähnchen',
  'peixe': 'Fisch', 'ovo': 'Ei', 'leite': 'Milch', 'pão': 'Brot',
  'queijo': 'Käse', 'fruta': 'Obst', 'legume': 'Gemüse', 'salada': 'Salat',
  'água': 'Wasser', 'café': 'Kaffee', 'suco': 'Saft',
  
  // Exercícios
  'exercício': 'Übung', 'treino': 'Training', 'musculação': 'Krafttraining',
  'cardio': 'Cardio', 'alongamento': 'Dehnung', 'aquecimento': 'Aufwärmen',
  'flexão': 'Liegestütz', 'agachamento': 'Kniebeuge', 'abdominal': 'Bauchpresse',
  'prancha': 'Plank', 'corrida': 'Laufen', 'caminhada': 'Spaziergang',
  'natação': 'Schwimmen', 'ciclismo': 'Radfahren', 'yoga': 'Yoga', 'pilates': 'Pilates',
  
  // Saúde
  'saúde': 'Gesundheit', 'doença': 'Krankheit', 'remédio': 'Medikament',
  'vitamina': 'Vitamin', 'proteína': 'Protein', 'carboidrato': 'Kohlenhydrat',
  'gordura': 'Fett', 'caloria': 'Kalorie', 'dieta': 'Diät', 'nutrição': 'Ernährung',
  
  // Sentimentos
  'alegria': 'Freude', 'tristeza': 'Traurigkeit', 'raiva': 'Wut', 'medo': 'Angst',
  'surpresa': 'Überraschung', 'amor': 'Liebe', 'feliz': 'glücklich', 'triste': 'traurig',
  'cansado': 'müde', 'animado': 'aufgeregt',
  
  // Tempo
  'hoje': 'heute', 'ontem': 'gestern', 'amanhã': 'morgen', 'agora': 'jetzt',
  'depois': 'nachher', 'antes': 'vorher', 'sempre': 'immer', 'nunca': 'nie',
  
  // Lugares
  'casa': 'Haus', 'academia': 'Fitnessstudio', 'escola': 'Schule', 'trabalho': 'Arbeit',
  'parque': 'Park', 'praia': 'Strand', 'restaurante': 'Restaurant', 'hospital': 'Krankenhaus',
  
  // Cores
  'vermelho': 'rot', 'azul': 'blau', 'verde': 'grün', 'amarelo': 'gelb',
  'laranja': 'orange', 'roxo': 'lila', 'rosa': 'rosa', 'preto': 'schwarz',
  'branco': 'weiß', 'marrom': 'braun', 'cinza': 'grau',
  
  // Girias alemãs
  'legal': 'super', 'bacana': 'toll', 'massa': 'genial', 'top': 'top',
  'firme': 'solid', 'tranquilo': 'ruhig', 'cara': 'Typ', 'maluco': 'verrückt',
};

const VOCABULARY_IT = {
  // Corpo humano
  'corpo': 'corpo', 'cabeça': 'testa', 'rosto': 'viso', 'olhos': 'occhi',
  'boca': 'bocca', 'nariz': 'naso', 'orelhas': 'orecchie', 'pescoço': 'collo',
  'ombros': 'spalle', 'braços': 'braccia', 'mãos': 'mani', 'dedos': 'dita',
  'peito': 'petto', 'costas': 'schiena', 'abdomen': 'addome', 'quadril': 'fianchi',
  'pernas': 'gambe', 'joelhos': 'ginocchia', 'pés': 'piedi',
  
  // Alimentos
  'arroz': 'riso', 'feijão': 'fagioli', 'carne': 'carne', 'frango': 'pollo',
  'peixe': 'pesce', 'ovo': 'uovo', 'leite': 'latte', 'pão': 'pane',
  'queijo': 'formaggio', 'fruta': 'frutta', 'legume': 'verdura', 'salada': 'insalata',
  'água': 'acqua', 'café': 'caffè', 'suco': 'succo',
  
  // Exercícios
  'exercício': 'esercizio', 'treino': 'allenamento', 'musculação': 'palestrismo',
  'cardio': 'cardio', 'alongamento': 'stretching', 'aquecimento': 'riscaldamento',
  'flexão': 'push-up', 'agachamento': 'squat', 'abdominal': 'addominali',
  'prancha': 'plank', 'corrida': 'corsa', 'caminhada': 'camminata',
  'natação': 'nuoto', 'ciclismo': 'ciclismo', 'yoga': 'yoga', 'pilates': 'pilates',
  
  // Saúde
  'saúde': 'salute', 'doença': 'malattia', 'remédio': 'farmaco', 'vitamina': 'vitamina',
  'proteína': 'proteina', 'carboidrato': 'carboidrati', 'gordura': 'grasso', 'caloria': 'caloria',
  'dieta': 'dieta', 'nutrição': 'nutrizione',
  
  // Sentimentos
  'alegria': 'gioia', 'tristeza': 'tristezza', 'raiva': 'rabbia', 'medo': 'paura',
  'surpresa': 'sorpresa', 'amor': 'amore', 'feliz': 'felice', 'triste': 'triste',
  'cansado': 'stanco', 'animado': 'emozionato',
  
  // Tempo
  'hoje': 'oggi', 'ontem': 'ieri', 'amanhã': 'domani', 'agora': 'adesso',
  'depois': 'dopo', 'antes': 'prima', 'sempre': 'sempre', 'nunca': 'mai',
  
  // Lugares
  'casa': 'casa', 'academia': 'palestra', 'escola': 'scuola', 'trabalho': 'lavoro',
  'parque': 'parco', 'praia': 'spiaggia', 'restaurante': 'ristorante', 'hospital': 'ospedale',
  
  // Cores
  'vermelho': 'rosso', 'azul': 'blu', 'verde': 'verde', 'amarelo': 'giallo',
  'laranja': 'arancione', 'roxo': 'viola', 'rosa': 'rosa', 'preto': 'nero',
  'branco': 'bianco', 'marrom': 'marrone', 'cinza': 'grigio',
  
  // Girias italianas
  'legal': 'figata', 'bacana': 'fantastico', 'massa': 'geniale', 'top': 'top',
  'firme': 'solido', 'tranquilo': 'tranquillo', 'cara': 'tipo', 'maluco': 'pazzo',
};

function generateDictionary(vocab, lang) {
  const dictionary = {};
  for (const [key, value] of Object.entries(vocab)) {
    dictionary[key] = value;
  }
  return dictionary;
}

function saveDictionary(dictionary, lang, entries) {
  const outputPath = path.join(__dirname, '..', 'src', 'dictionaries', `dictionary${lang}.ts`);
  const content = `// dictionary${lang}.ts - Dicionário ${lang.toUpperCase()} com ${entries} entradas
// Gerado automaticamente pelo script generate-fr-de-it.js

export const ${lang.toUpperCase()}_DICTIONARY: Record<string, string> = ${JSON.stringify(dictionary, null, 2)};
`;
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Dicionário ${lang.toUpperCase()} salvo: ${outputPath} (${entries} entradas)`);
}

function main() {
  console.log('Gerando dicionários FR, DE, IT...');
  
  const frDict = generateDictionary(VOCABULARY_FR, 'fr');
  saveDictionary(frDict, 'fr', Object.keys(frDict).length);
  
  const deDict = generateDictionary(VOCABULARY_DE, 'de');
  saveDictionary(deDict, 'de', Object.keys(deDict).length);
  
  const itDict = generateDictionary(VOCABULARY_IT, 'it');
  saveDictionary(itDict, 'it', Object.keys(itDict).length);
  
  console.log('Geração FR, DE, IT concluída!');
}

main();
