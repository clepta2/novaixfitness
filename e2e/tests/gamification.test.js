// e2e/tests/gamification.test.js
// Testes E2E de gamificacao - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Gamification Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show XP and level on profile', async () => {
    await element(by.text('Perfil')).tap();
    await expect(element(by.text('Nivel'))).toBeVisible();
    await expect(element(by.text('XP'))).toBeVisible();
  });

  it('should show achievements list', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Conquistas')).tap();
    await expect(element(by.text('Conquistas'))).toBeVisible();
  });

  it('should show leaderboard', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Ranking')).tap();
    await expect(element(by.text('Ranking'))).toBeVisible();
  });

  it('should show streak counter', async () => {
    await element(by.text('Perfil')).tap();
    await expect(element(by.text('Sequencia'))).toBeVisible();
  });

  it('should unlock achievement after workout', async () => {
    await element(by.text('Treino de hoje')).tap();
    await element(by.text('INICIAR TREINO')).tap();
    await element(by.text('Finalizar')).tap();
    await expect(element(by.text('Conquista desbloqueada!'))).toBeVisible();
  });

  it('should show level up notification', async () => {
    await element(by.text('Perfil')).tap();
    await expect(element(by.text('Proximo nivel'))).toBeVisible();
  });
});
