// ============================================
// REGRAS 76-80: DEFESA DE PROTOCOLO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Proteger contra ataques de protocolo HTTP e banco.
 */

module.exports = {
  name: 'Protocol Defense',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Defesa contra ataques de protocolo',

  rules: [
    {
      id: 'R76_HPP_ADVANCED',
      name: 'Advanced HPP Prevention',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('req.query') && !content.includes('req.body')) return [];
        const hasHppMiddleware = content.includes('hpp') || content.includes('express-rate-limit');
        if (!hasHppMiddleware && content.includes('app.use')) {
          return [{ file: filePath, line: 0, rule: 'R76_HPP_ADVANCED', message: 'Sem middleware HPP no Express', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R77_ERROR_TIMING',
      name: 'Error Timing Uniformity',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('catch') || !content.includes('error')) return [];
        const hasTimingProtection = content.includes('timingSafe') || content.includes('constant') || content.includes('uniform');
        if (!hasTimingProtection) {
          return [{ file: filePath, line: 0, rule: 'R77_ERROR_TIMING', message: 'Erros com timing diferente permitem side-channel attacks', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R78_CACHE_HEADERS',
      name: 'Cache Header Security',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('cache') && !content.includes('Cache-Control')) return [];
        const hasSecureCache = content.includes('no-store') || content.includes('private') || content.includes('no-cache');
        if (!hasSecureCache && content.includes('Cache-Control')) {
          return [{ file: filePath, line: 0, rule: 'R78_CACHE_HEADERS', message: 'Cache-Control sem diretivas de segurança', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R79_COOKIE_SIZE',
      name: 'Cookie Size Limit',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('cookie') || !content.includes('setCookie')) return [];
        const hasSizeCheck = content.includes('length') || content.includes('max') || content.includes('limit');
        if (!hasSizeCheck) {
          return [{ file: filePath, line: 0, rule: 'R79_COOKIE_SIZE', message: 'Cookies sem verificação de tamanho - DoS vulnerável', severity: 'WARNING' }];
        }
        return [];
      },
    },
    {
      id: 'R80_JSON_VALIDATION',
      name: 'JSON Syntax Error Handling',
      severity: 'WARNING',
      check: (filePath, content) => {
        if (!content.includes('JSON.parse') && !content.includes('express.json')) return [];
        const hasErrorHandling = content.includes('try') || content.includes('SyntaxError') || content.includes('catch');
        if (!hasErrorHandling) {
          return [{ file: filePath, line: 0, rule: 'R80_JSON_VALIDATION', message: 'JSON parsing sem tratamento de SyntaxError', severity: 'WARNING' }];
        }
        return [];
      },
    },
  ],
};
