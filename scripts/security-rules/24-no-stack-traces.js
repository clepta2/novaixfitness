// ============================================
// REGRA 24: STACK TRACES EXPOSTOS
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear envio de stack traces ao cliente.
 */

module.exports = {
  name: 'No Stack Traces',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Bloqueia stack traces em responses',

  rules: [
    {
      id: 'R24_STACK_TRACE',
      name: 'Stack Trace Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /error\.(?:stack|message|trace)\s*[,})]/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R24_STACK_TRACE',
            message: 'Stack trace exposto ao cliente. Em produção, retorne mensagem genérica',
            severity: 'WARNING', code: match[0].substring(0, 40),
          });
        }
        return violations;
      },
    },
  ],
};
