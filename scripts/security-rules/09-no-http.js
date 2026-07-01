// ============================================
// REGRA 9: FORÇAR HTTPS
// ============================================
// Nível: ALTO | Tipo: BLOCK

/**
 * OBJETIVO: Bloquear requisições HTTP não-criptografadas.
 *
 * POR QUE É PERIGOSO:
 * - Dados via HTTP podem ser interceptados (MITM)
 * - Atacante pode modificar tráfego em rede pública
 * - Roubo de credenciais em Wi-Fi
 */

module.exports = {
  name: 'Force HTTPS',
  version: '1.0.0',
  severity: 'BLOCK',
  description: 'Bloqueia HTTP não-criptografado',

  rules: [
    {
      id: 'R09_NO_HTTP',
      name: 'HTTP Detection',
      severity: 'BLOCK',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /['"]http:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/gi;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R09_NO_HTTP',
            message: 'HTTP não-criptografado detectado. Use HTTPS',
            severity: 'BLOCK', code: match[0].substring(0, 60),
          });
        }
        return violations;
      },
    },
  ],
};
