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
  t: (key, params = {}) => {
    const tr = translations[key] || key;
    return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), tr);
  }, locale: 'pt', setLocale: () => {},
});

module.exports = {
  I18nProvider: ({ children }) => React.createElement(I18nContext.Provider, {
    value: {
      t: (key, params = {}) => {
        const tr = translations[key] || key;
        return Object.entries(params).reduce((s, [k, v]) => s.replace(`{${k}}`, v), tr);
      }, locale: 'pt', setLocale: () => {},
    },
  }, children),
  useI18n: () => React.useContext(I18nContext),
};