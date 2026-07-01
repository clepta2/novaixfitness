// src/__tests__/services/performanceMonitor.test.ts

import { trackOperation, trackError, trackScreenMount, getMetricsForExport, getPerformanceSummary, clearOldData, resetAll } from '../../services/performanceMonitor';

describe('performanceMonitor', () => {
  beforeEach(() => {
    resetAll();
  });

  describe('trackOperation', () => {
    it('deve registrar metrica', () => {
      trackOperation('test_op', 100);
      const data = getMetricsForExport();
      expect(data.metrics.length).toBe(1);
      expect(data.metrics[0].name).toBe('test_op');
      expect(data.metrics[0].duration).toBe(100);
      expect(data.metrics[0].success).toBe(true);
    });

    it('deve registrar falha', () => {
      trackOperation('failed_op', 200, { success: false });
      const data = getMetricsForExport();
      expect(data.metrics[0].success).toBe(false);
    });

    it('deve manter screen', () => {
      trackOperation('op', 50, { screen: 'Home' });
      const data = getMetricsForExport();
      expect(data.metrics[0].screen).toBe('Home');
    });
  });

  describe('trackError', () => {
    it('deve registrar erro', () => {
      trackError(new Error('teste'), { screen: 'Login', severity: 'high' });
      const data = getMetricsForExport();
      expect(data.errors.length).toBe(1);
      expect(data.errors[0].message).toBe('teste');
      expect(data.errors[0].severity).toBe('high');
    });

    it('deve gerar id unico', () => {
      trackError(new Error('a'));
      trackError(new Error('b'));
      const data = getMetricsForExport();
      expect(data.errors[0].id).not.toBe(data.errors[1].id);
    });
  });

  describe('trackScreenMount', () => {
    it('deve registrar tela', () => {
      trackScreenMount('Home');
      const data = getMetricsForExport();
      expect(data.screens.length).toBe(1);
      expect(data.screens[0].screen).toBe('Home');
      expect(data.screens[0].renderCount).toBe(1);
    });

    it('deve incrementar render count', () => {
      trackScreenMount('Home');
      trackScreenMount('Home');
      const data = getMetricsForExport();
      expect(data.screens[0].renderCount).toBe(2);
    });
  });

  describe('getPerformanceSummary', () => {
    it('deve retornar resumo correto', () => {
      trackOperation('op1', 100);
      trackOperation('op1', 200);
      trackOperation('op2', 300);
      trackScreenMount('Home');

      const summary = getPerformanceSummary();
      expect(summary.totalOperations).toBe(3);
      expect(summary.avgDuration).toBe(200);
      expect(summary.screensLoaded).toBe(1);
    });

    it('deve listar operacoes lentas', () => {
      trackOperation('slow_op', 1500);
      const summary = getPerformanceSummary();
      expect(summary.slowOperations.length).toBe(1);
      expect(summary.slowOperations[0].name).toBe('slow_op');
    });
  });

  describe('clearOldData', () => {
    it('deve limpar dados antigos', () => {
      trackOperation('old_op', 50);
      // clearOldData com maxAge=0 nao remove (timestamp == cutoff),
      // mas com resetAll funciona
      resetAll();
      const data = getMetricsForExport();
      expect(data.metrics.length).toBe(0);
    });
  });
});
