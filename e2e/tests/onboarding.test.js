// e2e/tests/onboarding.test.js
// Testes E2E de onboarding - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show intro screen', async () => {
    await expect(element(by.text('NOVAIX FITNESS'))).toBeVisible();
    await expect(element(by.text('Comecar'))).toBeVisible();
  });

  it('should complete intro slides', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await expect(element(by.text('Qual seu objetivo?'))).toBeVisible();
  });

  it('should complete goal selection', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await element(by.text('Hipertrofia')).tap();
    await element(by.text('Proximo')).tap();
    await expect(element(by.text('Qual seu nivel?'))).toBeVisible();
  });

  it('should complete level selection', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await element(by.text('Hipertrofia')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Intermediario')).tap();
    await element(by.text('Proximo')).tap();
    await expect(element(by.text('Quantos dias por semana?'))).toBeVisible();
  });

  it('should complete days selection', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await element(by.text('Hipertrofia')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Intermediario')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('4 dias')).tap();
    await element(by.text('Proximo')).tap();
    await expect(element(by.text('Onde voce treina?'))).toBeVisible();
  });

  it('should complete location selection', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await element(by.text('Hipertrofia')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Intermediario')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('4 dias')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Academia')).tap();
    await element(by.text('Proximo')).tap();
    await expect(element(by.text('Seu plano esta pronto!'))).toBeVisible();
  });

  it('should finish onboarding', async () => {
    await element(by.text('Comecar')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Comecar agora')).tap();
    await element(by.text('Hipertrofia')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Intermediario')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('4 dias')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Academia')).tap();
    await element(by.text('Proximo')).tap();
    await element(by.text('Gerar meu plano')).tap();
    await expect(element(by.text('Bem-vindo ao NOVAIX!'))).toBeVisible();
  });
});
