// src/__tests__/services/sanitization.test.ts

import {
  sanitizeInput, stripHtml, sanitizeUrl, truncate,
  sanitizeUsername, sanitizePostContent, detectSuspiciousPatterns,
} from '../../services/security/sanitization';

describe('sanitization', () => {
  describe('sanitizeInput', () => {
    it('remove tags HTML', () => {
      expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    });

    it('remove event handlers', () => {
      expect(sanitizeInput('text onclick=alert(1)')).toBe('text alert(1)');
    });

    it('mantem texto limpo', () => {
      expect(sanitizeInput('Olá mundo')).toBe('Olá mundo');
    });
  });

  describe('stripHtml', () => {
    it('remove todas as tags', () => {
      expect(stripHtml('<b>bold</b> <i>italic</i>')).toBe('bold italic');
    });
  });

  describe('sanitizeUrl', () => {
    it('aceita http', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('aceita https', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
    });

    it('rejeita javascript', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    });

    it('rejeita data uri', () => {
      expect(sanitizeUrl('data:text/html,<h1>hi</h1>')).toBeNull();
    });

    it('rejeita url invalida', () => {
      expect(sanitizeUrl('not-a-url')).toBeNull();
    });
  });

  describe('truncate', () => {
    it('nao trunca string curta', () => {
      expect(truncate('abc', 10)).toBe('abc');
    });

    it('trunca string longa', () => {
      expect(truncate('abcdefghij', 5)).toBe('ab...');
    });
  });

  describe('sanitizeUsername', () => {
    it('remove caracteres especiais', () => {
      expect(sanitizeUsername('João Silva!')).toBe('joosilva');
    });

    it('limita tamanho', () => {
      expect(sanitizeUsername('a'.repeat(50))).toHaveLength(30);
    });

    it('remove inicio invalido', () => {
      expect(sanitizeUsername('.test')).toBe('test');
    });
  });

  describe('detectSuspiciousPatterns', () => {
    it('detecta XSS', () => {
      const r = detectSuspiciousPatterns('<script>alert(1)</script>');
      expect(r.suspicious).toBe(true);
      expect(r.patterns).toContain('XSS_SCRIPT');
    });

    it('detecta SQL injection', () => {
      const r = detectSuspiciousPatterns('1 UNION SELECT * FROM users');
      expect(r.suspicious).toBe(true);
      expect(r.patterns).toContain('SQL_INJECT');
    });

    it('detecta path traversal', () => {
      const r = detectSuspiciousPatterns('../../etc/passwd');
      expect(r.suspicious).toBe(true);
      expect(r.patterns).toContain('PATH_TRAVERSAL');
    });

    it('nao marca texto limpo', () => {
      const r = detectSuspiciousPatterns('Texto normal sem problemas');
      expect(r.suspicious).toBe(false);
    });
  });
});
