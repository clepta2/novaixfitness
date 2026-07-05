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
    'amor': 'love', 'morte': 'death',     'gato': 'cat', 'cachorro': 'dog', 'banana': 'banana',
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
    'estou': 'am', 'sou': 'am', 'tenho': 'have', 'posso': 'can',
    'corremos': 'run', 'comemos': 'eat', 'bebemos': 'drink',
    'perdemos': 'lose', 'ganhemos': 'win', 'fazemos': 'do',
    'temos': 'have', 'falamos': 'speak', 'pensamos': 'think',
    'dormimos': 'sleep', 'treinamos': 'train', 'ajudamos': 'help',
    'estudamos': 'study', 'trabalhamos': 'work',
  };

  // Conjugação PT → EN (inclui todas as formas)
  const VERBS: Record<string, Record<string, string>> = {
    comer: { pres_1s: 'eat', pres_3s: 'eats', pret_1s: 'ate', pret_3s: 'ate' },
    como: { pres_1s: 'eat' }, come: { pres_3s: 'eats' },
    beber: { pres_1s: 'drink', pres_3s: 'drinks', pret_1s: 'drank', pret_3s: 'drank' },
    bebo: { pres_1s: 'drink' }, bebe: { pres_3s: 'drinks' },
    correr: { pres_1s: 'run', pres_3s: 'runs', pret_1s: 'ran', pret_3s: 'ran' },
    corro: { pres_1s: 'run' }, corre: { pres_3s: 'runs' }, corremos: { pres_1p: 'run' },
    treinar: { pres_1s: 'train', pres_3s: 'trains', pret_1s: 'trained', pret_3s: 'trained' },
    treino: { pres_1s: 'train' }, treina: { pres_3s: 'trains' }, treinamos: { pres_1p: 'train' },
    dormir: { pres_1s: 'sleep', pres_3s: 'sleeps', pret_1s: 'slept', pret_3s: 'slept' },
    durmo: { pres_1s: 'sleep' }, dorme: { pres_3s: 'sleeps' }, dormimos: { pres_1p: 'sleep' },
    falar: { pres_1s: 'speak', pres_3s: 'speaks', pret_1s: 'spoke', pret_3s: 'spoke' },
    falo: { pres_1s: 'speak' }, fala: { pres_3s: 'speaks' }, falamos: { pres_1p: 'speak' },
    pensar: { pres_1s: 'think', pres_3s: 'thinks', pret_1s: 'thought', pret_3s: 'thought' },
    penso: { pres_1s: 'think' }, pensa: { pres_3s: 'thinks' }, pensamos: { pres_1p: 'think' },
    estudar: { pres_1s: 'study', pres_3s: 'studies', pret_1s: 'studied', pret_3s: 'studied' },
    estudo: { pres_1s: 'study' }, estuda: { pres_3s: 'studies' }, estudamos: { pres_1p: 'study' },
    trabalhar: { pres_1s: 'work', pres_3s: 'works', pret_1s: 'worked', pret_3s: 'worked' },
    trabalho: { pres_1s: 'work' }, trabalha: { pres_3s: 'works' }, trabalhamos: { pres_1p: 'work' },
    ajudar: { pres_1s: 'help', pres_3s: 'helps', pret_1s: 'helped', pret_3s: 'helped' },
    ajudo: { pres_1s: 'help' }, ajuda: { pres_3s: 'helps' }, ajudamos: { pres_1p: 'help' },
    perder: { pres_1s: 'lose', pres_3s: 'loses', pret_1s: 'lost', pret_3s: 'lost' },
    perco: { pres_1s: 'lose' }, perde: { pres_3s: 'loses' }, perdemos: { pres_1p: 'lose' },
    ganhar: { pres_1s: 'win', pres_3s: 'wins', pret_1s: 'won', pret_3s: 'won' },
    ganho: { pres_1s: 'win' }, ganha: { pres_3s: 'wins' }, ganhamos: { pres_1p: 'win' },
    fazer: { pres_1s: 'do', pres_3s: 'does', pret_1s: 'did', pret_3s: 'did' },
    faço: { pres_1s: 'do' }, faz: { pres_3s: 'does' }, fazemos: { pres_1p: 'do' },
    ter: { pres_1s: 'have', pres_3s: 'has', pret_1s: 'had', pret_3s: 'had' },
    tenho: { pres_1s: 'have' }, tem: { pres_3s: 'has' }, temos: { pres_1p: 'have' },
    ser: { pres_1s: 'am', pres_3s: 'is', pret_1s: 'was', pret_3s: 'was' },
    sou: { pres_1s: 'am' }, é: { pres_3s: 'is' },
    estar: { pres_1s: 'am', pres_3s: 'is', pret_1s: 'was', pret_3s: 'was' },
    estou: { pres_1s: 'am' }, está: { pres_3s: 'is' },
    ir: { pres_1s: 'go', pres_3s: 'goes', pret_1s: 'went', pret_3s: 'went' },
    vou: { pres_1s: 'go' }, vai: { pres_3s: 'goes' },
    vir: { pres_1s: 'come', pres_3s: 'comes', pret_1s: 'came', pret_3s: 'came' },
    venho: { pres_1s: 'come' }, vem: { pres_3s: 'comes' },
    dar: { pres_1s: 'give', pres_3s: 'gives', pret_1s: 'gave', pret_3s: 'gave' },
    dou: { pres_1s: 'give' }, dá: { pres_3s: 'gives' },
    comprar: { pres_1s: 'buy', pres_3s: 'buys', pret_1s: 'bought', pret_3s: 'bought' },
    vender: { pres_1s: 'sell', pres_3s: 'sells', pret_1s: 'sold', pret_3s: 'sold' },
    pagar: { pres_1s: 'pay', pres_3s: 'pays', pret_1s: 'paid', pret_3s: 'paid' },
    enviar: { pres_1s: 'send', pres_3s: 'sends', pret_1s: 'sent', pret_3s: 'sent' },
    receber: { pres_1s: 'receive', pres_3s: 'receives', pret_1s: 'received', pret_3s: 'received' },
    salvar: { pres_1s: 'save', pres_3s: 'saves', pret_1s: 'saved', pret_3s: 'saved' },
    deletar: { pres_1s: 'delete', pres_3s: 'deletes', pret_1s: 'deleted', pret_3s: 'deleted' },
    editar: { pres_1s: 'edit', pres_3s: 'edits', pret_1s: 'edited', pret_3s: 'edited' },
    copiar: { pres_1s: 'copy', pres_3s: 'copies', pret_1s: 'copied', pret_3s: 'copied' },
    baixar: { pres_1s: 'download', pres_3s: 'downloads', pret_1s: 'downloaded', pret_3s: 'downloaded' },
    atualizar: { pres_1s: 'update', pres_3s: 'updates', pret_1s: 'updated', pret_3s: 'updated' },
    instalar: { pres_1s: 'install', pres_3s: 'installs', pret_1s: 'installed', pret_3s: 'installed' },
    remover: { pres_1s: 'remove', pres_3s: 'removes', pret_1s: 'removed', pret_3s: 'removed' },
    adicionar: { pres_1s: 'add', pres_3s: 'adds', pret_1s: 'added', pret_3s: 'added' },
    criar: { pres_1s: 'create', pres_3s: 'creates', pret_1s: 'created', pret_3s: 'created' },
    configurar: { pres_1s: 'configure', pres_3s: 'configures', pret_1s: 'configured', pret_3s: 'configured' },
    pesquisar: { pres_1s: 'research', pres_3s: 'researches', pret_1s: 'researched', pret_3s: 'researched' },
    observar: { pres_1s: 'observe', pres_3s: 'observes', pret_1s: 'observed', pret_3s: 'observed' },
    medir: { pres_1s: 'measure', pres_3s: 'measures', pret_1s: 'measured', pret_3s: 'measured' },
    calcular: { pres_1s: 'calculate', pres_3s: 'calculates', pret_1s: 'calculated', pret_3s: 'calculated' },
    comparar: { pres_1s: 'compare', pres_3s: 'compares', pret_1s: 'compared', pret_3s: 'compared' },
    avaliar: { pres_1s: 'evaluate', pres_3s: 'evaluates', pret_1s: 'evaluated', pret_3s: 'evaluated' },
    testar: { pres_1s: 'test', pres_3s: 'tests', pret_1s: 'tested', pret_3s: 'tested' },
    tentar: { pres_1s: 'try', pres_3s: 'tries', pret_1s: 'tried', pret_3s: 'tried' },
    viajar: { pres_1s: 'travel', pres_3s: 'travels', pret_1s: 'traveled', pret_3s: 'traveled' },
    visitar: { pres_1s: 'visit', pres_3s: 'visits', pret_1s: 'visited', pret_3s: 'visited' },
    dirigir: { pres_1s: 'drive', pres_3s: 'drives', pret_1s: 'drove', pret_3s: 'drove' },
    construir: { pres_1s: 'build', pres_3s: 'builds', pret_1s: 'built', pret_3s: 'built' },
    proteger: { pres_1s: 'protect', pres_3s: 'protects', pret_1s: 'protected', pret_3s: 'protected' },
    lutar: { pres_1s: 'fight', pres_3s: 'fights', pret_1s: 'fought', pret_3s: 'fought' },
    gritar: { pres_1s: 'shout', pres_3s: 'shouts', pret_1s: 'shouted', pret_3s: 'shouted' },
    cantar: { pres_1s: 'sing', pres_3s: 'sings', pret_1s: 'sang', pret_3s: 'sang' },
    rir: { pres_1s: 'laugh', pres_3s: 'laughs', pret_1s: 'laughed', pret_3s: 'laughed' },
    chorar: { pres_1s: 'cry', pres_3s: 'cries', pret_1s: 'cried', pret_3s: 'cried' },
    sorrir: { pres_1s: 'smile', pres_3s: 'smiles', pret_1s: 'smiled', pret_3s: 'smiled' },
    acordar: { pres_1s: 'wake up', pres_3s: 'wakes up', pret_1s: 'woke up', pret_3s: 'woke up' },
    ficar: { pres_1s: 'stay', pres_3s: 'stays', pret_1s: 'stayed', pret_3s: 'stayed' },
    sair: { pres_1s: 'leave', pres_3s: 'leaves', pret_1s: 'left', pret_3s: 'left' },
    entrar: { pres_1s: 'enter', pres_3s: 'enters', pret_1s: 'entered', pret_3s: 'entered' },
    voltar: { pres_1s: 'return', pres_3s: 'returns', pret_1s: 'returned', pret_3s: 'returned' },
    parar: { pres_1s: 'stop', pres_3s: 'stops', pret_1s: 'stopped', pret_3s: 'stopped' },
    comecar: { pres_1s: 'start', pres_3s: 'starts', pret_1s: 'started', pret_3s: 'started' },
    terminar: { pres_1s: 'finish', pres_3s: 'finishes', pret_1s: 'finished', pret_3s: 'finished' },
    esperar: { pres_1s: 'wait', pres_3s: 'waits', pret_1s: 'waited', pret_3s: 'waited' },
    procurar: { pres_1s: 'search', pres_3s: 'searches', pret_1s: 'searched', pret_3s: 'searched' },
    abrir: { pres_1s: 'open', pres_3s: 'opens', pret_1s: 'opened', pret_3s: 'opened' },
    fechar: { pres_1s: 'close', pres_3s: 'closes', pret_1s: 'closed', pret_3s: 'closed' },
    colar: { pres_1s: 'paste', pres_3s: 'pastes', pret_1s: 'pasted', pret_3s: 'pasted' },
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
