// e2e/tests/chat.test.js
// Testes E2E de chat com IA - NOVAIX FITNESS

const { by, device, element, expect } = require('detox');

describe('Chat Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should open chat screen', async () => {
    await element(by.label('Chat com Coach')).tap();
    await expect(element(by.text('Coach IA'))).toBeVisible();
  });

  it('should send a message', async () => {
    await element(by.label('Chat com Coach')).tap();
    await element(by.type('RCTTextInput')).typeText('Ola, preciso de ajuda com meu treino');
    await element(by.label('Enviar mensagem')).tap();
    await expect(element(by.text('Ola, preciso de ajuda com meu treino'))).toBeVisible();
  });

  it('should receive AI response', async () => {
    await element(by.label('Chat com Coach')).tap();
    await element(by.type('RCTTextInput')).typeText('Qual o melhor exercicio para peito?');
    await element(by.label('Enviar mensagem')).tap();
    await expect(element(by.text('Supino'))).toBeVisible();
  });

  it('should show quick actions', async () => {
    await element(by.label('Chat com Coach')).tap();
    await expect(element(by.text('Treino'))).toBeVisible();
    await expect(element(by.text('Nutricao'))).toBeVisible();
    await expect(element(by.text('Recuperacao'))).toBeVisible();
  });

  it('should use quick action', async () => {
    await element(by.label('Chat com Coach')).tap();
    await element(by.text('Treino')).tap();
    await expect(element(by.text('Me ajude com meu treino'))).toBeVisible();
  });

  it('should clear chat history', async () => {
    await element(by.label('Chat com Coach')).tap();
    await element(by.label('Limpar historico')).tap();
    await element(by.text('Confirmar')).tap();
    await expect(element(by.text('Historico limpo'))).toBeVisible();
  });

  it('should show typing indicator', async () => {
    await element(by.label('Chat com Coach')).tap();
    await element(by.type('RCTTextInput')).typeText('Me conta sobre nutricao');
    await element(by.label('Enviar mensagem')).tap();
    await expect(element(by.text('Digitando...'))).toBeVisible();
  });
});
