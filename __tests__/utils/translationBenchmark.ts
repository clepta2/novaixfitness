// __tests__/utils/translationBenchmark.ts
// Benchmark: TradNinja dicionário vs lookup direto

const fs = require('fs');
const path = require('path');

// ── Carregar dicionários TradNinja ─────────────────────────
function loadTradNinjaDict(lang: string): Record<string, string> {
  try {
    const dictPath = path.resolve(__dirname, `../../../tradninja/src/dictionaries/dictionary${lang}.ts`);
    const content = fs.readFileSync(dictPath, 'utf8');
    const map: Record<string, string> = {};
    const regex = /'([^']+)':\s*\{\s*\w+:\s*'([^']+)'\s*\}/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      map[match[1]] = match[2];
    }
    return map;
  } catch {
    return {};
  }
}

// ── Simular lookup i18n antigo ──────────────────────────────
function i18nLookup(key: string, translations: Record<string, unknown>): string {
  const keys = key.split('.');
  let value: unknown = translations;
  for (const k of keys) {
    if (value === null || value === undefined || typeof value !== 'object') return key;
    value = (value as Record<string, unknown>)[k];
  }
  return typeof value === 'string' ? value : key;
}

// ── Dicionário TradNinja ────────────────────────────────────
const dictEN = loadTradNinjaDict('en');
const dictES = loadTradNinjaDict('es');
const ptDictionary = new Map(Object.entries(dictEN));

// ── Dados fake para benchmark ──────────────────────────────
const ptData: Record<string, unknown> = {
  common: { save: 'Salvar', cancel: 'Cancelar', back: 'Voltar', ok: 'OK' },
  auth: { login: 'Entrar', signup: 'Cadastrar', forgotPassword: 'Esqueci a senha' },
  home: { title: 'Inicio', welcome: 'Bem-vindo', viewAll: 'Ver tudo' },
  workout: { start: 'Iniciar', finish: 'Finalizar', rating: 'Avaliacao' },
  nutrition: { water: 'Agua', meals: 'Refeicoes', calories: 'Calorias' },
  profile: { settings: 'Configuracoes', edit: 'Editar', logout: 'Sair' },
  social: { post: 'Publicar', comment: 'Comentar', like: 'Curtir' },
  subscription: { plan: 'Plano', price: 'Preco', subscribe: 'Assinar' },
  chat: { send: 'Enviar', placeholder: 'Mensagem...', typing: 'Digitando...' },
  notifications: { title: 'Notificacoes', settings: 'Configuracoes', clear: 'Limpar' },
  onboarding: { goal: 'Objetivo', experience: 'Experiencia', body: 'Corpo' },
  gamification: { xp: 'XP', level: 'Nivel', achievement: 'Conquista' },
  player: { play: 'Reproduzir', pause: 'Pausar', timer: 'Timer' },
  library: { search: 'Buscar', filter: 'Filtrar', sort: 'Ordenar' },
};

const testKeys = [
  'common.save', 'common.cancel', 'common.back', 'common.ok',
  'auth.login', 'auth.signup', 'auth.forgotPassword',
  'home.title', 'home.welcome', 'home.viewAll',
  'workout.start', 'workout.finish', 'workout.rating',
  'nutrition.water', 'nutrition.meals', 'nutrition.calories',
  'profile.settings', 'profile.edit', 'profile.logout',
  'social.post', 'social.comment', 'social.like',
  'subscription.plan', 'subscription.price', 'subscription.subscribe',
  'chat.send', 'chat.placeholder', 'chat.typing',
  'notifications.title', 'notifications.settings', 'notifications.clear',
  'onboarding.goal', 'onboarding.experience', 'onboarding.body',
  'gamification.xp', 'gamification.level', 'gamification.achievement',
  'player.play', 'player.pause', 'player.timer',
  'library.search', 'library.filter', 'library.sort',
];

describe('Translation Benchmark', () => {
  it('TradNinja dicionario vs i18n lookup: 10000 ops', () => {
    const iterations = 10000;

    // Método 1: i18n lookup (chave → valor do JSON)
    const i18nStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const key = testKeys[i % testKeys.length];
      i18nLookup(key, ptData);
    }
    const i18nTime = performance.now() - i18nStart;

    // Método 2: TradNinja dicionário (Map O(1))
    const dictStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const key = testKeys[i % testKeys.length];
      const ptValue = i18nLookup(key, ptData);
      ptDictionary.get(ptValue);
    }
    const dictTime = performance.now() - dictStart;

    console.log(`\n=== Translation Benchmark (${iterations} ops) ===`);
    console.log(`i18n lookup:      ${i18nTime.toFixed(2)}ms (${(i18nTime / iterations * 1000).toFixed(1)}μs/op)`);
    console.log(`TradNinja dict:   ${dictTime.toFixed(2)}ms (${(dictTime / iterations * 1000).toFixed(1)}μs/op)`);
    console.log(`Dictionary size:  ${ptDictionary.size} termos`);

    expect(dictTime).toBeLessThan(i18nTime * 10);
  });

  it('TradNinja: multi-language dictionaries', () => {
    console.log(`EN dictionary: ${Object.keys(dictEN).length} terms`);
    console.log(`ES dictionary: ${Object.keys(dictES).length} terms`);

    expect(Object.keys(dictEN).length).toBeGreaterThan(0);
    expect(Object.keys(dictES).length).toBeGreaterThan(0);
  });

  it('TradNinja: 500 lookups com parametros', () => {
    const iterations = 500;
    const keysWithParams = [
      { key: 'common.save', params: { xp: 50 } },
      { key: 'home.title', params: { count: 7 } },
      { key: 'workout.start', params: { count: 30 } },
    ];

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const { key, params } = keysWithParams[i % keysWithParams.length];
      const ptValue = i18nLookup(key, ptData);
      const translated = ptDictionary.get(ptValue) || ptValue;
      const result = translated.replace(/\{(\w+)\}/g, (_, p) => params[p] !== undefined ? String(params[p]) : `{${p}}`);
      result;
    }
    const time = performance.now() - start;

    console.log(`\n=== Parametros (${iterations} ops) ===`);
    console.log(`Tempo: ${time.toFixed(2)}ms (${(time / iterations * 1000).toFixed(1)}us/op)`);

    expect(time).toBeLessThan(2000);
  });
});
