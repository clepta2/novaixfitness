// e2e/tests/social.test.js
// Teste E2E: Funcionalidades sociais

const { device, element, by, expect } = require('detox');

describe('Social Features', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should show community feed', async () => {
    await element(by.text('Comunidade')).tap();
    await expect(element(by.text('COMUNIDADE'))).toBeVisible();
  });

  it('should create a new post', async () => {
    await element(by.id('fab-create-post')).tap();
    await expect(element(by.text('Novo Post'))).toBeVisible();
  });

  it('should type post content', async () => {
    await element(by.id('post-input')).typeText('Meu primeiro post!');
    await expect(element(by.text('Meu primeiro post!'))).toBeVisible();
  });

  it('should like a post', async () => {
    await element(by.id('like-button')).atIndex(0).tap();
    await expect(element(by.id('like-button')).atIndex(0)).toHaveValue('liked');
  });

  it('should comment on a post', async () => {
    await element(by.id('comment-button')).atIndex(0).tap();
    await element(by.id('comment-input')).typeText('Parabéns!');
    await element(by.id('send-comment')).tap();
    await expect(element(by.text('Parabéns!'))).toBeVisible();
  });

  it('should open chat', async () => {
    await element(by.text('Chat')).tap();
    await expect(element(by.text('MENSAGENS'))).toBeVisible();
  });
});
