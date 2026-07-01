// e2e/tests/health.test.js
// Testes E2E de integracao com saude - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Health Integration Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show health settings', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await expect(element(by.text('Apple Health'))).toBeVisible();
  });

  it('should request health permissions', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await element(by.text('Conectar')).tap();
    await expect(element(by.text('Permissoes concedidas'))).toBeVisible();
  });

  it('should sync weight data', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await element(by.text('Sincronizar peso')).tap();
    await expect(element(by.text('Peso sincronizado'))).toBeVisible();
  });

  it('should sync steps data', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await element(by.text('Sincronizar passos')).tap();
    await expect(element(by.text('Passos sincronizados'))).toBeVisible();
  });

  it('should show health summary', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await expect(element(by.text('Resumo saudavel'))).toBeVisible();
  });

  it('should disconnect health app', async () => {
    await element(by.text('Perfil')).tap();
    await element(by.text('Configuracoes')).tap();
    await element(by.text('Integracao Saude')).tap();
    await element(by.text('Desconectar')).tap();
    await element(by.text('Confirmar')).tap();
    await expect(element(by.text('Desconectado'))).toBeVisible();
  });
});
