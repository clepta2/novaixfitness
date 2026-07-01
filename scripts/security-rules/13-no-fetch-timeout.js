// ============================================
// REGRA 13: FETCH SEM TIMEOUT
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear fetch() sem timeout ou AbortController.
 *
 * POR QUE É PERIGOSO:
 * - Requisição pode travar para sempre
 * - Em horário de pico, trava o servidor inteiro
 * - Consome memória infinitamente
 */

module.exports = {
  name: 'Fetch Timeout Required',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Exige timeout em chamadas fetch',

  rules: [
    {
      id: 'R13_FETCH_TIMEOUT',
      name: 'Fetch Timeout Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /fetch\s*\((?!.*signal)(?!.*timeout)(?!.*AbortController)/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R13_FETCH_TIMEOUT',
            message: 'fetch() sem timeout/AbortController. Pode travar para sempre',
            severity: 'WARNING', code: line.trim().substring(0, 60),
          });
        }
        return violations;
      },
    },
  ],
};
