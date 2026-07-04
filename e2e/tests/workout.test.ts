// e2e/tests/workout.test.js
// Teste E2E: Fluxo de treino

const { device, element, by, expect } = require('detox');

describe('Workout Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Login primeiro (assumindo que há credenciais de teste)
  });

  it('should show home screen with workout', async () => {
    await expect(element(by.text('INÍCIO'))).toBeVisible();
  });

  it('should navigate to workout list', async () => {
    await element(by.text('Treinos')).tap();
    await expect(element(by.text('BIBLIOTECA'))).toBeVisible();
  });

  it('should open workout detail', async () => {
    await element(by.id('workout-card')).atIndex(0).tap();
    await expect(element(by.text('INICIAR'))).toBeVisible();
  });

  it('should start workout', async () => {
    await element(by.text('INICIAR')).tap();
    await expect(element(by.text('EXERCÍCIOS'))).toBeVisible();
  });

  it('should complete an exercise', async () => {
    await element(by.id('complete-exercise')).tap();
    await expect(element(by.text('PRÓXIMO'))).toBeVisible();
  });

  it('should use rest timer', async () => {
    await element(by.text('DESCANSO')).tap();
    await expect(element(by.text('0:30'))).toBeVisible();
  });
});
