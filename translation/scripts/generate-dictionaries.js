/**
 * Script gerador de dicionários para tradução
 * Gera dictionaries com entradas PT, EN, ES
 */

const fs = require('fs');
const path = require('path');

// Vocabulário base por categoria
const VOCABULARY = {
  // Corpo humano
  'corpo': { en: 'body', es: 'cuerpo' },
  'cabeça': { en: 'head', es: 'cabeza' },
  'rosto': { en: 'face', es: 'cara' },
  'olhos': { en: 'eyes', es: 'ojos' },
  'boca': { en: 'mouth', es: 'boca' },
  'nariz': { en: 'nose', es: 'nariz' },
  'orelhas': { en: 'ears', es: 'orejas' },
  'pescoço': { en: 'neck', es: 'cuello' },
  'ombros': { en: 'shoulders', es: 'hombros' },
  'braços': { en: 'arms', es: 'brazos' },
  'mãos': { en: 'hands', es: 'manos' },
  'dedos': { en: 'fingers', es: 'dedos' },
  'peito': { en: 'chest', es: 'pecho' },
  'costas': { en: 'back', es: 'espalda' },
  'abdomen': { en: 'abdomen', es: 'abdomen' },
  'quadril': { en: 'hips', es: 'caderas' },
  'pernas': { en: 'legs', es: 'piernas' },
  'joelhos': { en: 'knees', es: 'rodillas' },
  'pés': { en: 'feet', es: 'pies' },
  
  // Alimentos
  'arroz': { en: 'rice', es: 'arroz' },
  'feijão': { en: 'beans', es: 'frijoles' },
  'carne': { en: 'meat', es: 'carne' },
  'frango': { en: 'chicken', es: 'pollo' },
  'peixe': { en: 'fish', es: 'pescado' },
  'ovo': { en: 'egg', es: 'huevo' },
  'leite': { en: 'milk', es: 'leche' },
  'pão': { en: 'bread', es: 'pan' },
  'queijo': { en: 'cheese', es: 'queso' },
  'fruta': { en: 'fruit', es: 'fruta' },
  'legume': { en: 'vegetable', es: 'verdura' },
  'salada': { en: 'salad', es: 'ensalada' },
  'sopa': { en: 'soup', es: 'sopa' },
  'suco': { en: 'juice', es: 'jugo' },
  'água': { en: 'water', es: 'agua' },
  'café': { en: 'coffee', es: 'café' },
  'cha': { en: 'tea', es: 'té' },
  
  // Exercícios
  'exercício': { en: 'exercise', es: 'ejercicio' },
  'treino': { en: 'workout', es: 'entrenamiento' },
  'musculação': { en: 'weight training', es: 'musculación' },
  'cardio': { en: 'cardio', es: 'cardio' },
  'alongamento': { en: 'stretching', es: 'estiramiento' },
  'aquecimento': { en: 'warm-up', es: 'calentamiento' },
  'flexão': { en: 'push-up', es: 'flexión de brazos' },
  'agachamento': { en: 'squat', es: 'sentadilla' },
  'abdominal': { en: 'crunch', es: 'abdominal' },
  'prancha': { en: 'plank', es: 'plancha' },
  'corrida': { en: 'running', es: 'correr' },
  'caminhada': { en: 'walking', es: 'caminar' },
  'natação': { en: 'swimming', es: 'natación' },
  'ciclismo': { en: 'cycling', es: 'ciclismo' },
  'yoga': { en: 'yoga', es: 'yoga' },
  'pilates': { en: 'pilates', es: 'pilates' },
  
  // Saúde
  'saúde': { en: 'health', es: 'salud' },
  'doença': { en: 'disease', es: 'enfermedad' },
  'remédio': { en: 'medicine', es: 'medicamento' },
  'vitamina': { en: 'vitamin', es: 'vitamina' },
  'proteína': { en: 'protein', es: 'proteína' },
  'carboidrato': { en: 'carbohydrate', es: 'carbohidrato' },
  'gordura': { en: 'fat', es: 'grasa' },
  'caloria': { en: 'calorie', es: 'caloría' },
  'dieta': { en: 'diet', es: 'dieta' },
  'nutrição': { en: 'nutrition', es: 'nutrición' },
  
  // Emocões
  'alegria': { en: 'joy', es: 'alegría' },
  'tristeza': { en: 'sadness', es: 'tristeza' },
  'raiva': { en: 'anger', es: 'ira' },
  'medo': { en: 'fear', es: 'miedo' },
  'surpresa': { en: 'surprise', es: 'sorpresa' },
  'amor': { en: 'love', es: 'amor' },
  'feliz': { en: 'happy', es: 'feliz' },
  'triste': { en: 'sad', es: 'triste' },
  'bravo': { en: 'angry', es: 'enojado' },
  'calmo': { en: 'calm', es: 'calmado' },
  'cansado': { en: 'tired', es: 'cansado' },
  'animado': { en: 'excited', es: 'animado' },
  
  // Tempo
  'hoje': { en: 'today', es: 'hoy' },
  'ontem': { en: 'yesterday', es: 'ayer' },
  'amanhã': { en: 'tomorrow', es: 'mañana' },
  'agora': { en: 'now', es: 'ahora' },
  'depois': { en: 'after', es: 'después' },
  'antes': { en: 'before', es: 'antes' },
  'sempre': { en: 'always', es: 'siempre' },
  'nunca': { en: 'never', es: 'nunca' },
  'às vezes': { en: 'sometimes', es: 'a veces' },
  'geralmente': { en: 'usually', es: 'generalmente' },
  
  // Lugares
  'casa': { en: 'house', es: 'casa' },
  'academia': { en: 'gym', es: 'gimnasio' },
  'escola': { en: 'school', es: 'escuela' },
  'trabalho': { en: 'work', es: 'trabajo' },
  'parque': { en: 'park', es: 'parque' },
  'praia': { en: 'beach', es: 'playa' },
  'restaurante': { en: 'restaurant', es: 'restaurante' },
  'mercado': { en: 'market', es: 'mercado' },
  'farmácia': { en: 'pharmacy', es: 'farmacia' },
  'hospital': { en: 'hospital', es: 'hospital' },
  
  // Números
  'um': { en: 'one', es: 'uno' },
  'dois': { en: 'two', es: 'dos' },
  'três': { en: 'three', es: 'tres' },
  'quatro': { en: 'four', es: 'cuatro' },
  'cinco': { en: 'five', es: 'cinco' },
  'seis': { en: 'six', es: 'seis' },
  'sete': { en: 'seven', es: 'siete' },
  'oito': { en: 'eight', es: 'ocho' },
  'nove': { en: 'nine', es: 'nueve' },
  'dez': { en: 'ten', es: 'diez' },
  
  // Cores
  'vermelho': { en: 'red', es: 'rojo' },
  'azul': { en: 'blue', es: 'azul' },
  'verde': { en: 'green', es: 'verde' },
  'amarelo': { en: 'yellow', es: 'amarillo' },
  'laranja': { en: 'orange', es: 'naranja' },
  'roxo': { en: 'purple', es: 'morado' },
  'rosa': { en: 'pink', es: 'rosa' },
  'preto': { en: 'black', es: 'negro' },
  'branco': { en: 'white', es: 'blanco' },
  'marrom': { en: 'brown', es: 'marrón' },
  'cinza': { en: 'gray', es: 'gris' },
  
  // Roupas
  'camisa': { en: 'shirt', es: 'camisa' },
  'calça': { en: 'pants', es: 'pantalones' },
  'sapato': { en: 'shoe', es: 'zapato' },
  'bota': { en: 'boot', es: 'bota' },
  'chapéu': { en: 'hat', es: 'sombrero' },
  'casaco': { en: 'coat', es: 'abrigo' },
  'vestido': { en: 'dress', es: 'vestido' },
  'saia': { en: 'skirt', es: 'falda' },
  
  // Móveis
  'cama': { en: 'bed', es: 'cama' },
  'mesa': { en: 'table', es: 'mesa' },
  'cadeira': { en: 'chair', es: 'silla' },
  'sofá': { en: 'sofa', es: 'sofá' },
  'armário': { en: 'wardrobe', es: 'armario' },
  'geladeira': { en: 'refrigerator', es: 'refrigerador' },
  'fogão': { en: 'stove', es: 'estufa' },
  
  // Natureza
  'árvore': { en: 'tree', es: 'árbol' },
  'flor': { en: 'flower', es: 'flor' },
  'rio': { en: 'river', es: 'río' },
  'montanha': { en: 'mountain', es: 'montaña' },
  'mar': { en: 'sea', es: 'mar' },
  'céu': { en: 'sky', es: 'cielo' },
  'sol': { en: 'sun', es: 'sol' },
  'lua': { en: 'moon', es: 'luna' },
  'estrela': { en: 'star', es: 'estrella' },
  
  // Transporte
  'carro': { en: 'car', es: 'coche' },
  'ônibus': { en: 'bus', es: 'autobús' },
  'trem': { en: 'train', es: 'tren' },
  'avião': { en: 'airplane', es: 'avión' },
  'bicicleta': { en: 'bicycle', es: 'bicicleta' },
  'moto': { en: 'motorcycle', es: 'motocicleta' },
  
  // Tecnologia
  'computador': { en: 'computer', es: 'computadora' },
  'celular': { en: 'cellphone', es: 'celular' },
  'telefone': { en: 'phone', es: 'teléfono' },
  'internet': { en: 'internet', es: 'internet' },
  'tela': { en: 'screen', es: 'pantalla' },
  'teclado': { en: 'keyboard', es: 'teclado' },
  'câmera': { en: 'camera', es: 'cámara' },
  
  // Profissões
  'médico': { en: 'doctor', es: 'médico' },
  'enfermeiro': { en: 'nurse', es: 'enfermero' },
  'professor': { en: 'teacher', es: 'profesor' },
  'engenheiro': { en: 'engineer', es: 'ingeniero' },
  'advogado': { en: 'lawyer', es: 'abogado' },
  'dentista': { en: 'dentist', es: 'dentista' },
  'cozineiro': { en: 'cook', es: 'cocinero' },
  'motorista': { en: 'driver', es: 'conductor' },
  'vendedor': { en: 'seller', es: 'vendedor' },
  'jornalista': { en: 'journalist', es: 'periodista' },
  
  // Girias brasileiras
  'mano': { en: 'bro', es: 'hermano' },
  'mina': { en: 'girl', es: 'chica' },
  'grana': { en: 'money', es: 'plata' },
  'rolê': { en: 'hangout', es: 'paseo' },
  'balada': { en: 'club', es: 'discoteca' },
  'blz': { en: 'all good', es: 'todo bien' },
  'vlw': { en: 'thanks', es: 'gracias' },
  'flw': { en: 'bye', es: 'adiós' },
  'tbm': { en: 'also', es: 'también' },
  'legal': { en: 'cool', es: 'genial' },
  'bacana': { en: 'cool', es: 'genial' },
  'massa': { en: 'awesome', es: 'genial' },
  'top': { en: 'top', es: 'genial' },
  'show': { en: 'great', es: 'genial' },
  'firme': { en: 'firm', es: 'firme' },
  'tranquilo': { en: 'chill', es: 'tranquilo' },
  'de boa': { en: 'chill', es: 'tranquilo' },
  'suave': { en: 'smooth', es: 'suave' },
  'e aí': { en: "what's up", es: 'qué tal' },
  'com certeza': { en: 'for sure', es: 'por supuesto' },
  'pode crer': { en: 'believe it', es: 'créele' },
  'cara': { en: 'guy', es: 'tipo' },
  'maluco': { en: 'crazy', es: 'loco' },
  'doido': { en: 'crazy', es: 'loco' },
  'pai': { en: 'dad', es: 'papá' },
  'mãe': { en: 'mom', es: 'mamá' },
  'forte': { en: 'strong', es: 'fuerte' },
  'rápido': { en: 'fast', es: 'rápido' },
  'devagar': { en: 'slow', es: 'lento' },
  'grande': { en: 'big', es: 'grande' },
  'pequeno': { en: 'small', es: 'pequeño' },
  'alto': { en: 'tall', es: 'alto' },
  'bonito': { en: 'pretty', es: 'bonito' },
  'feio': { en: 'ugly', es: 'feo' },
  'novo': { en: 'new', es: 'nuevo' },
  'velho': { en: 'old', es: 'viejo' },
  'bom': { en: 'good', es: 'bueno' },
  'mau': { en: 'bad', es: 'malo' },
  'certo': { en: 'right', es: 'correcto' },
  'errado': { en: 'wrong', es: 'equivocado' },
  'fácil': { en: 'easy', es: 'fácil' },
  'difícil': { en: 'hard', es: 'difícil' },
  'importante': { en: 'important', es: 'importante' },
  'problema': { en: 'problem', es: 'problema' },
  'solução': { en: 'solution', es: 'solución' },
  'razão': { en: 'reason', es: 'razón' },
  'motivo': { en: 'motivation', es: 'motivo' },
  'objetivo': { en: 'goal', es: 'objetivo' },
  'meta': { en: 'goal', es: 'meta' },
  'sonho': { en: 'dream', es: 'sueño' },
  'esperança': { en: 'hope', es: 'esperanza' },
  'coragem': { en: 'courage', es: 'coraje' },
  'força': { en: 'strength', es: 'fuerza' },
  'energia': { en: 'energy', es: 'energía' },
  'cansaço': { en: 'tiredness', es: 'cansancio' },
  'descanso': { en: 'rest', es: 'descanso' },
  'sono': { en: 'sleep', es: 'sueño' },
  'fome': { en: 'hunger', es: 'hambre' },
  'sede': { en: 'thirst', es: 'sed' },
  'dor': { en: 'pain', es: 'dolor' },
  'febre': { en: 'fever', es: 'fiebre' },
  'gripe': { en: 'flu', es: 'gripe' },
  'resfriado': { en: 'cold', es: 'resfriado' },
  'tosse': { en: 'cough', es: 'tos' },
  'dor de cabeça': { en: 'headache', es: 'dolor de cabeza' },
  'dor de barriga': { en: 'stomachache', es: 'dolor de estómago' },
  'dor de dente': { en: 'toothache', es: 'dolor de muelas' },
  'dor nas costas': { en: 'back pain', es: 'dolor de espalda' },
  'dor no joelho': { en: 'knee pain', es: 'dolor de rodilla' },
  'dor no pé': { en: 'foot pain', es: 'dolor de pie' },
  'dor no ombro': { en: 'shoulder pain', es: 'dolor de hombro' },
  'dor no pescoço': { en: 'neck pain', es: 'dolor de cuello' },
  'dor no pulso': { en: 'wrist pain', es: 'dolor de muñeca' },
  'dor no quadril': { en: 'hip pain', es: 'dolor de cadera' },
  'dor na perna': { en: 'leg pain', es: 'dolor de pierna' },
  'dor no braço': { en: 'arm pain', es: 'dolor de brazo' },
  'dor no peito': { en: 'chest pain', es: 'dolor de pecho' },
  'dor na garganta': { en: 'sore throat', es: 'dolor de garganta' },
  'dor muscular': { en: 'muscle pain', es: 'dolor muscular' },
  'dor articular': { en: 'joint pain', es: 'dolor articular' },
  'dor crônica': { en: 'chronic pain', es: 'dolor crónico' },
  'dor aguda': { en: 'acute pain', es: 'dolor agudo' },
  'dor intensa': { en: 'intense pain', es: 'dolor intenso' },
  'dor leve': { en: 'mild pain', es: 'dolor leve' },
  'dor moderada': { en: 'moderate pain', es: 'dolor moderado' },
};

function generateDictionary() {
  const dictionary = {};
  
  // Adicionar vocabulário base
  for (const [key, value] of Object.entries(VOCABULARY)) {
    dictionary[key] = value;
  }
  
  return dictionary;
}

function main() {
  console.log('Gerando dicionário PT...');
  
  const dictionary = generateDictionary();
  const entries = Object.keys(dictionary).length;
  
  console.log(`Total de entradas: ${entries}`);
  
  // Salvar dicionário PT
  const outputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionarypt.ts');
  const content = `// dictionarypt.ts - Dicionário PT com ${entries} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const PT_DICTIONARY: Record<string, { en: string; es: string }> = ${JSON.stringify(dictionary, null, 2)};
`;
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Dicionário PT salvo em: ${outputPath}`);
  
  // Gerar dicionário EN (invertido)
  const enDictionary = {};
  for (const [pt, translations] of Object.entries(dictionary)) {
    enDictionary[translations.en] = { pt, es: translations.es };
  }
  
  const enOutputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionaryen.ts');
  const enContent = `// dictionaryen.ts - Dicionário EN com ${Object.keys(enDictionary).length} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const EN_DICTIONARY: Record<string, { pt: string; es: string }> = ${JSON.stringify(enDictionary, null, 2)};
`;
  
  fs.writeFileSync(enOutputPath, enContent, 'utf-8');
  console.log(`Dicionário EN salvo em: ${enOutputPath}`);
  
  // Gerar dicionário ES (invertido)
  const esDictionary = {};
  for (const [pt, translations] of Object.entries(dictionary)) {
    esDictionary[translations.es] = { pt, en: translations.en };
  }
  
  const esOutputPath = path.join(__dirname, '..', 'src', 'dictionaries', 'dictionaryes.ts');
  const esContent = `// dictionaryes.ts - Dicionário ES com ${Object.keys(esDictionary).length} entradas
// Gerado automaticamente pelo script generate-dictionaries.ts

export const ES_DICTIONARY: Record<string, { pt: string; en: string }> = ${JSON.stringify(esDictionary, null, 2)};
`;
  
  fs.writeFileSync(esOutputPath, esContent, 'utf-8');
  console.log(`Dicionário ES salvo em: ${esOutputPath}`);
  
  console.log('Geração concluída!');
}

main();
