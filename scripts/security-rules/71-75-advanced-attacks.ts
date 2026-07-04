// ============================================
// REGRAS 71-75: ATAQUES AVANÇADOS
// ============================================
// Nível: CRÍTICO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear ataques avançados de rede e protocolo.
 */

module.exports = {
  name: 'Advanced Attack Prevention',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Prevenção de ataques avançados',

  rules: [
    {
      id: 'R71_HPP',
      name: 'HTTP Parameter Pollution',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!content.includes('req.query') || !content.includes('req.body')) return [];
        const hasHpp = content.includes('hpp') || content.includes('sanitize') || content.includes('deduplicate');
        if (!hasHpp) {
          return [{ file: filePath, line: 0, rule: 'R71_HPP', message: 'Sem proteção contra HTTP Parameter Pollution', severity: 'BLOCK' }];
        }
        return [];
      },
    },
    {
      id: 'R72_ERROR_UNIFORMITY',
      name: 'Error Response Uniformity',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!content.includes('catch') || !content.includes('error')) return [];
        const hasGenericError = content.includes('generic') || content.includes('same') || content.includes('uniform');
        if (!hasGenericError && content.includes('res.status')) {
          return [{ file: filePath, line: 0, rule: 'R72_ERROR_UNIFORMITY', message: 'Erros diferentes revelam informações internas', severity: 'BLOCK' }];
        }
        return [];
      },
    },
    {
      id: 'R73_CACHE_POISONING',
      name: 'Web Cache Poisoning',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!content.includes('cache') || !content.includes('cdn')) return [];
        const hasProtection = content.includes('cache-key') || content.includes('ignore') || content.includes('whitelist');
        if (!hasProtection) {
          return [{ file: filePath, line: 0, rule: 'R73_CACHE_POISONING', message: 'Cache sem proteção contra poisoning', severity: 'BLOCK' }];
        }
        return [];
      },
    },
    {
      id: 'R74_SESSION_SIZE',
      name: 'Session Key Size Limit',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!content.includes('cookie') && !content.includes('session')) return [];
        const hasSizeLimit = content.includes('maxSize') || content.includes('length') || content.includes('limit');
        if (!hasSizeLimit) {
          return [{ file: filePath, line: 0, rule: 'R74_SESSION_SIZE', message: 'Sessões sem limite de tamanho - DoS por hash', severity: 'BLOCK' }];
        }
        return [];
      },
    },
    {
      id: 'R75_MALFORMED_JSON',
      name: 'Malformed JSON Protection',
      severity: 'BLOCK',
      check: (filePath, content) => {
        if (!content.includes('json') || !content.includes('parse')) return [];
        const hasProtection = content.includes('try') || content.includes('SyntaxError') || content.includes('catch');
        if (!hasProtection) {
          return [{ file: filePath, line: 0, rule: 'R75_MALFORMED_JSON', message: 'JSON parsing sem tratamento de erro - DoS vulnerável', severity: 'BLOCK' }];
        }
        return [];
      },
    },
  ],
};
