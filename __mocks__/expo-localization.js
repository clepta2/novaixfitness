// __mocks__/expo-localization.js

module.exports = {
  getLocales: jest.fn().mockReturnValue([{ languageCode: 'pt', regionCode: 'BR' }]),
  getCalendars: jest.fn().mockReturnValue([{ uses24hourClock: true }]),
  locale: 'pt-BR',
  timezone: 'America/Sao_Paulo',
};