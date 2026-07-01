// e2e/tests/auth.test.js
// Testes E2E de autenticacao - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.text('NOVAIX FITNESS'))).toBeVisible();
    await expect(element(by.text('ENTRAR'))).toBeVisible();
  });

  it('should navigate to register screen', async () => {
    await element(by.text('Cadastre-se')).tap();
    await expect(element(by.text('CADASTRAR'))).toBeVisible();
  });

  it('should show validation errors on empty submit', async () => {
    await element(by.text('CADASTRAR')).tap();
    await expect(element(by.text('Preencha todos os campos'))).toBeVisible();
  });

  it('should navigate to forgot password', async () => {
    await element(by.text('Esqueceu a senha?')).tap();
    await expect(element(by.text('REDEFINIR'))).toBeVisible();
  });

  it('should go back to login from register', async () => {
    await element(by.text('Cadastre-se')).tap();
    await element(by.text('Voltar')).tap();
    await expect(element(by.text('ENTRAR'))).toBeVisible();
  });
});
