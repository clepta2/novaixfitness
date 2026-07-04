const React = require('react');

const translations = {
  'home.bodyEvolution': 'Evolução Corporal', 'home.viewAll': 'Ver tudo',
  'home.recentPhotos': 'Fotos recentes', 'home.viewAllPhotos': 'Ver todas',
  'progress.weight': 'Peso', 'progress.bmi': 'IMC', 'progress.bodyFat': 'Gordura',
  'challenges.completedTitle': 'Concluído!', 'challenges.completedXP': '+{xp} XP',
  'challenges.seeMore': 'Ver mais', 'home.streakLegend': 'Lenda {count}',
  'home.streakAmazing': 'Incrível {count}', 'home.streakContinue': 'Continue {count}',
  'home.streakFlow': 'Fluxo {count}',
};

const I18nContext = React.createContext({
  t: (key: string, params: Record<string, any> = {}) => {
    const tr = translations[key] || key;
    return Object.entries(params).reduce((s: string, [k, v]) => s.replace(`{${k}}`, String(v)), tr);
  },
  translateText: async (text: string) => text,
  locale: 'pt',
  changeLocale: () => {},
  translator: { translate: (text: string) => ({ text, matched: false }) },
});

module.exports = {
  I18nProvider: ({ children }: { children: React.ReactNode }) => React.createElement(I18nContext.Provider, {
    value: {
      t: (key: string, params: Record<string, any> = {}) => {
        const tr = translations[key] || key;
        return Object.entries(params).reduce((s: string, [k, v]) => s.replace(`{${k}}`, String(v)), tr);
      },
      translateText: async (text: string) => text,
      locale: 'pt',
      changeLocale: () => {},
      translator: { translate: (text: string) => ({ text, matched: false }) },
    },
  }, children),
  useI18n: () => React.useContext(I18nContext),
};
