// e2e/tests/navigation.test.js
// Testes E2E de navegacao - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Navigation', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate between tabs', async () => {
    await element(by.text('Biblioteca')).tap();
    await expect(element(by.text('Biblioteca'))).toBeVisible();

    await element(by.text('Comunidade')).tap();
    await expect(element(by.text('Feed'))).toBeVisible();

    await element(by.text('Perfil')).tap();
    await expect(element(by.text('Configuracoes'))).toBeVisible();
  });

  it('should open and close modals', async () => {
    await element(by.label('Criar Post')).tap();
    await expect(element(by.text('Criar publicacao'))).toBeVisible();

    await element(by.text('Fechar')).tap();
    await expect(element(by.text('Criar publicacao'))).not.toBeVisible();
  });

  it('should navigate to settings', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await expect(element(by.text('Tema'))).toBeVisible();
  });

  it('should navigate to notifications', async () => {
    await element(by.label('Notificacoes')).tap();
    await expect(element(by.text('Notificacoes'))).toBeVisible();
  });
});
