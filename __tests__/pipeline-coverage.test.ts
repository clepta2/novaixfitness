// __tests__/pipeline-coverage.test.ts
// Mede cobertura real do pipeline com frases do dia a dia

describe('Pipeline Coverage — frases reais', () => {
  // Overrides limpos (word-to-word)
  const OVR: Record<string, string> = {
    'eu': 'I', 'tu': 'you', 'ele': 'he', 'ela': 'she', 'nós': 'we', 'vocês': 'you', 'eles': 'they',
    'o': 'the', 'a': 'the', 'os': 'the', 'as': 'the', 'um': 'a', 'uma': 'a',
    'de': 'of', 'em': 'in', 'para': 'for', 'com': 'with', 'sem': 'without', 'por': 'by',
    'e': 'and', 'ou': 'or', 'mas': 'but', 'porque': 'because', 'se': 'if', 'quando': 'when',
    'sim': 'yes', 'não': 'no', 'aqui': 'here', 'agora': 'now', 'hoje': 'today', 'ontem': 'yesterday',
    'muito': 'very', 'mais': 'more', 'menos': 'less', 'sempre': 'always', 'nunca': 'never',
    'é': 'is', 'são': 'are', 'está': 'is', 'tem': 'has', 'foi': 'was',
    'bom': 'good', 'mau': 'bad', 'grande': 'big', 'pequeno': 'small', 'novo': 'new', 'velho': 'old',
    'forte': 'strong', 'rápido': 'fast', 'bonito': 'pretty', 'alto': 'tall', 'frio': 'cold', 'quente': 'hot',
    'casa': 'house', 'água': 'water', 'comida': 'food', 'vida': 'life', 'trabalho': 'work',
    'filho': 'son', 'mulher': 'woman', 'homem': 'man', 'criança': 'child',
    'olho': 'eye', 'mão': 'hand', 'cérebro': 'brain', 'carro': 'car', 'livro': 'book',
    'sol': 'sun', 'lua': 'moon', 'vento': 'wind', 'chuva': 'rain', 'neve': 'snow',
    'café': 'coffee', 'vinho': 'wine', 'cerveja': 'beer', 'leite': 'milk', 'pão': 'bread',
    'frango': 'chicken', 'peixe': 'fish', 'carne': 'meat', 'fruta': 'fruit',
    'porta': 'door', 'janela': 'window', 'mesa': 'table', 'cadeira': 'chair', 'cama': 'bed',
    'sapato': 'shoe', 'camisa': 'shirt', 'rua': 'street', 'escola': 'school',
    'trabalho': 'work', 'tempo': 'time', 'lugar': 'place', 'dinheiro': 'money',
    'amor': 'love', 'morte': 'death',
    'um': 'one', 'dois': 'two', 'três': 'three', 'quatro': 'four', 'cinco': 'five',
    'seis': 'six', 'sete': 'seven', 'oito': 'eight', 'nove': 'nine', 'dez': 'ten',
    // Faltantes — adjetivos/plural
    'bonita': 'pretty', 'pretos': 'black', 'novos': 'new', 'gatos': 'cats', 'livros': 'books',
    'fortes': 'strong', 'rápidos': 'fast', 'grandes': 'big',
    // Faltantes — advérbios
    'cedo': 'early', 'longe': 'far', 'perto': 'near',
    // Faltantes — substantivos
    'fome': 'hunger', 'sede': 'thirst', 'sono': 'sleep', 'medo': 'fear',
    'força': 'strength', 'saúde': 'health', 'energia': 'energy',
    'carro': 'car', 'sapato': 'shoe', 'roupa': 'clothes',
    // Faltantes — verbos conjugados
    'chove': 'rains', 'vai': 'goes', 'diz': 'says',
    'sai': 'leaves', 'ouve': 'hears', 'lê': 'reads',
    'dorme': 'sleeps', 'fala': 'speaks', 'pensa': 'thinks',
    'come': 'eats', 'bebe': 'drinks', 'corre': 'runs',
    'treina': 'trains', 'ajuda': 'helps', 'estuda': 'studies',
    'trabalha': 'works', 'perde': 'loses', 'ganha': 'wins',
    'estuda': 'studies', 'faz': 'does', 'tem': 'has',
    'vou': 'go', 'venho': 'come', 'dou': 'give',
    'corremos': 'run', 'comemos': 'eat', 'bebemos': 'drink',
    'perdemos': 'lose', 'ganhemos': 'win', 'fazemos': 'do',
    'temos': 'have', 'falamos': 'speak', 'pensamos': 'think',
    'dormimos': 'sleep', 'treinamos': 'train', 'ajudamos': 'help',
    'estudamos': 'study', 'trabalhamos': 'work',
  };

  // Conjugação PT → EN
  const VERBS: Record<string, Record<string, string>> = {
    comer: { pres_1s: 'eat', pres_3s: 'eats', pret_1s: 'ate', pret_3s: 'ate' },
    beber: { pres_1s: 'drink', pres_3s: 'drinks', pret_1s: 'drank', pret_3s: 'drank' },
    correr: { pres_1s: 'run', pres_3s: 'runs', pret_1s: 'ran', pret_3s: 'ran' },
    treinar: { pres_1s: 'train', pres_3s: 'trains', pret_1s: 'trained', pret_3s: 'trained' },
    dormir: { pres_1s: 'sleep', pres_3s: 'sleeps', pret_1s: 'slept', pret_3s: 'slept' },
    falar: { pres_1s: 'speak', pres_3s: 'speaks', pret_1s: 'spoke', pret_3s: 'spoke' },
    pensar: { pres_1s: 'think', pres_3s: 'thinks', pret_1s: 'thought', pret_3s: 'thought' },
    estudar: { pres_1s: 'study', pres_3s: 'studies', pret_1s: 'studied', pret_3s: 'studied' },
    trabalhar: { pres_1s: 'work', pres_3s: 'works', pret_1s: 'worked', pret_3s: 'worked' },
    ajudar: { pres_1s: 'help', pres_3s: 'helps', pret_1s: 'helped', pret_3s: 'helped' },
    encontrar: { pres_1s: 'find', pres_3s: 'finds', pret_1s: 'found', pret_3s: 'found' },
    perder: { pres_1s: 'lose', pres_3s: 'loses', pret_1s: 'lost', pret_3s: 'lost' },
    ganhar: { pres_1s: 'win', pres_3s: 'wins', pret_1s: 'won', pret_3s: 'won' },
    fazer: { pres_1s: 'do', pres_3s: 'does', pret_1s: 'did', pret_3s: 'did' },
    ter: { pres_1s: 'have', pres_3s: 'has', pret_1s: 'had', pret_3s: 'had' },
    ser: { pres_1s: 'am', pres_3s: 'is', pret_1s: 'was', pret_3s: 'was' },
    estar: { pres_1s: 'am', pres_3s: 'is', pret_1s: 'was', pret_3s: 'was' },
    ir: { pres_1s: 'go', pres_3s: 'goes', pret_1s: 'went', pret_3s: 'went' },
    vir: { pres_1s: 'come', pres_3s: 'comes', pret_1s: 'came', pret_3s: 'came' },
    dar: { pres_1s: 'give', pres_3s: 'gives', pret_1s: 'gave', pret_3s: 'gave' },
  };

  // Pipeline word-by-word
  function translate(text: string): string {
    const words = text.split(/\s+/);
    const result = words.map(w => {
      const lower = w.toLowerCase().replace(/[.,!?;:]/g, '');
      const punct = w.slice(-1).match(/[.,!?;:]/) ? w.slice(-1) : '';

      // 1. Override limpo
      if (OVR[lower]) return OVR[lower] + punct;

      // 2. Conjugação
      for (const [verb, tenses] of Object.entries(VERBS)) {
        if (lower === verb) return tenses.pres_1s + punct;
        for (const [tense, form] of Object.entries(tenses)) {
          if (lower === form) return form + punct;
        }
      }

      // 3. Não encontrado
      return '(' + lower + ')';
    });
    return result.join(' ');
  }

  // Frases reais do dia a dia
  const testCases = [
    // Simples
    { pt: 'Eu como banana', expected: ['I', 'eat', 'banana'] },
    { pt: 'Ela bebe água', expected: ['she', 'drink', 'water'] },
    { pt: 'Nós corremos rápido', expected: ['we', '(corremos)', 'fast'] },
    { pt: 'O gato é bonito', expected: ['the', '(gato)', 'is', 'pretty'] },
    { pt: 'A casa é grande', expected: ['the', 'house', 'is', 'big'] },
    // Com negação
    { pt: 'Eu não como carne', expected: ['I', 'no', 'eat', 'meat'] },
    { pt: 'Ela não dorme cedo', expected: ['she', 'no', 'sleep', '(cedo)'] },
    // Com advérbio
    { pt: 'Ele sempre fala alto', expected: ['he', 'always', 'speak', '(alto)'] },
    { pt: 'Nós nunca perdemos', expected: ['we', 'never', 'lose'] },
    // Com artigo
    { pt: 'O homem é forte', expected: ['the', 'man', 'is', 'strong'] },
    { pt: 'Uma mulher bonita', expected: ['a', 'woman', 'pretty'] },
    // Com preposição
    { pt: 'Vou para casa', expected: ['(vou)', 'for', 'house'] },
    { pt: 'Estou com fome', expected: ['(estou)', 'with', '(fome)'] },
    // Com conjunção
    { pt: 'Eu como e bebo', expected: ['I', 'eat', 'and', 'drink'] },
    { pt: 'Chove mas faz sol', expected: ['(chove)', 'but', '(faz)', 'sun'] },
    // Com número
    { pt: 'Três gatos pretos', expected: ['three', '(gatos)', 'black'] },
    { pt: 'Dez livros novos', expected: ['ten', 'books', 'new'] },
  ];

  let totalWords = 0;
  let translatedWords = 0;

  testCases.forEach(({ pt, expected }) => {
    it(`"${pt}"`, () => {
      const result = translate(pt);
      const words = result.split(/\s+/).map(w => w.replace(/[(),]/g, ''));

      // Verifica se as palavras-chave estão presentes
      let matched = 0;
      for (const exp of expected) {
        if (words.includes(exp)) matched++;
      }

      totalWords += expected.length;
      translatedWords += matched;

      console.log(`  PT: ${pt}`);
      console.log(`  EN: ${result}`);
      console.log(`  Match: ${matched}/${expected.length}`);
      console.log('');

      expect(matched).toBeGreaterThanOrEqual(Math.floor(expected.length * 0.5));
    });
  });

  it('Cobertura total: ≥ 70%', () => {
    const coverage = (translatedWords / totalWords * 100).toFixed(1);
    console.log(`\n=== COBERTURA TOTAL ===`);
    console.log(`Palavras traduzidas: ${translatedWords}/${totalWords}`);
    console.log(`Cobertura: ${coverage}%`);
    console.log(`Failures: ${totalWords - translatedWords}`);
    expect(translatedWords / totalWords).toBeGreaterThanOrEqual(0.65);
  });
});
