// e2e/jest.config.js
// Configuração de testes E2E com Detox

module.exports = {
  testTimeout: 120000,
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  reporters: ['detox/runners/jest/reporter'],
  testEnvironment: 'detox/runners/jest/testEnvironment',
  verbose: true,
};
