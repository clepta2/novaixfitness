// e2e/tests/login.test.js
// Teste E2E: Fluxo de login

const { device, element, by, expect } = require('detox');

describe('Login Flow', () => {
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

  it('should show validation error for empty fields', async () => {
    await element(by.text('ENTRAR')).tap();
    await expect(element(by.text('Preencha todos os campos'))).toBeVisible();
  });

  it('should show error for invalid email', async () => {
    await element(by.id('email-input')).typeText('invalid-email');
    await element(by.id('password-input')).typeText('password123');
    await element(by.text('ENTRAR')).tap();
    await expect(element(by.text('E-mail inválido'))).toBeVisible();
  });

  it('should navigate to register screen', async () => {
    await element(by.text('Cadastre-se')).tap();
    await expect(element(by.text('CRIAR CONTA'))).toBeVisible();
  });

  it('should navigate to forgot password', async () => {
    await element(by.text('Esqueceu a senha?')).tap();
    await expect(element(by.text('REDEFINIR SENHA'))).toBeVisible();
  });
});
