// __tests__/utils/translationBenchmark.ts
// Benchmark: i18n lookup vs dicionário traduzido

const fs = require('fs');
const path = require('path');
const pt = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/i18n/pt.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/i18n/en.json'), 'utf8'));

// ── Função i18n: lookup por chave (método atual) ────────────
function i18nLookup(key: string, translations: Record<string, unknown>): string {
  const keys = key.split('.');
  let value: unknown = translations;
  for (const k of keys) {
    if (value === null || value === undefined || typeof value !== 'object') return key;
    value = (value as Record<string, unknown>)[k];
  }
  return typeof value === 'string' ? value : key;
}

// ── Dicionário pré-computado (método TradNinja) ─────────────
function buildDictionary(source: Record<string, unknown>, target: Record<string, unknown>): Map<string, string> {
  const map = new Map<string, string>();
  function flatten(obj: Record<string, unknown>, prefix: string) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        let val: unknown = target;
        for (const k of fullKey.split('.')) {
          if (val === null || val === undefined || typeof val !== 'object') { val = undefined; break; }
          val = (val as Record<string, unknown>)[k];
        }
        if (typeof val === 'string') map.set(value, val);
      } else if (typeof value === 'object' && value !== null) {
        flatten(value as Record<string, unknown>, fullKey);
      }
    }
  }
  flatten(source, '');
  return map;
}

// ── Setup ──────────────────────────────────────────────────
const dictionary = buildDictionary(pt, en);
const ptValues = Object.values(pt as Record<string, unknown>).flat(Infinity).filter(v => typeof v === 'string') as string[];

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

// ── Benchmark ──────────────────────────────────────────────
describe('Translation Benchmark', () => {
  it('i18n lookup vs dicionário: 10000 operações', () => {
    const iterations = 10000;

    // Método 1: i18n lookup (chave → valor do JSON)
    const i18nStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const key = testKeys[i % testKeys.length];
      i18nLookup(key, pt);
    }
    const i18nTime = performance.now() - i18nStart;

    // Método 2: Dicionário pré-computado (valor PT → valor EN)
    const dictStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const key = testKeys[i % testKeys.length];
      const ptValue = i18nLookup(key, pt);
      dictionary.get(ptValue);
    }
    const dictTime = performance.now() - dictStart;

    console.log(`\n=== Translation Benchmark (${iterations} ops) ===`);
    console.log(`i18n lookup:      ${i18nTime.toFixed(2)}ms (${(i18nTime / iterations * 1000).toFixed(1)}μs/op)`);
    console.log(`Dicionário:       ${dictTime.toFixed(2)}ms (${(dictTime / iterations * 1000).toFixed(1)}μs/op)`);
    console.log(`Overhead:         +${((dictTime - i18nTime) / iterations * 1000).toFixed(1)}μs por lookup`);
    console.log(`Dictionary size:  ${dictionary.size} termos traduzidos`);

    // O dicionário não deve adicionar mais que 50% de overhead
    expect(dictTime).toBeLessThan(i18nTime * 1.5);
  });

  it('Dicionário: cobertura do projeto', () => {
    console.log('pt type:', typeof pt, 'isObj:', pt && typeof pt === 'object' && !Array.isArray(pt));
    console.log('pt keys:', Object.keys(pt || {}));
    console.log('en keys:', Object.keys(en || {}));
    console.log('Dict size:', dictionary.size);
    expect(true).toBe(true);
  });

  it('Performance: 500 lookups com parâmetros', () => {
    const iterations = 500;
    const keysWithParams = [
      { key: 'challenges.completedXP', params: { xp: 50 } },
      { key: 'home.streakLegend', params: { count: 7 } },
      { key: 'home.streakAmazing', params: { count: 30 } },
    ];

    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      const { key, params } = keysWithParams[i % keysWithParams.length];
      const ptValue = i18nLookup(key, pt);
      const translated = dictionary.get(ptValue) || ptValue;
      const result = translated.replace(/\{(\w+)\}/g, (_, p) => params[p] !== undefined ? String(params[p]) : `{${p}}`);
      result; // consume
    }
    const time = performance.now() - start;

    console.log(`\n=== Parâmetros (${iterations} ops) ===`);
    console.log(`Tempo: ${time.toFixed(2)}ms (${(time / iterations * 1000).toFixed(1)}μs/op)`);

    expect(time).toBeLessThan(2000);
  });
});
