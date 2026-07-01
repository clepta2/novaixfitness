// e2e/tests/payment.test.js
// Testes E2E de pagamento - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Payment Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show paywall screen', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await expect(element(by.text('Escolha seu plano'))).toBeVisible();
  });

  it('should select monthly plan', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Basico')).tap();
    await expect(element(by.text('Assinar agora'))).toBeVisible();
  });

  it('should select annual plan', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Anual')).tap();
    await element(by.text('Premium')).tap();
    await expect(element(by.text('Assinar agora'))).toBeVisible();
  });

  it('should apply coupon code', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Tem um cupom?')).tap();
    await element(by.type('RCTTextInput')).typeText('DESCONTO10');
    await element(by.text('Aplicar')).tap();
    await expect(element(by.text('Cupom aplicado!'))).toBeVisible();
  });

  it('should show payment methods', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Basico')).tap();
    await element(by.text('Assinar agora')).tap();
    await expect(element(by.text('PIX'))).toBeVisible();
    await expect(element(by.text('Cartao de credito'))).toBeVisible();
  });

  it('should process PIX payment', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Basico')).tap();
    await element(by.text('Assinar agora')).tap();
    await element(by.text('PIX')).tap();
    await expect(element(by.text('Copiar codigo'))).toBeVisible();
  });

  it('should cancel subscription', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Assinatura')).tap();
    await element(by.text('Gerenciar assinatura')).tap();
    await element(by.text('Cancelar assinatura')).tap();
    await element(by.text('Confirmar')).tap();
    await expect(element(by.text('Assinatura cancelada'))).toBeVisible();
  });
});
