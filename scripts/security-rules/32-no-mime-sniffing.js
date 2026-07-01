// ============================================
// REGRA 32: MIME SNIFFING
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Bloquear uploads sem validação de MIME type.
 */

module.exports = {
  name: 'MIME Sniffing Prevention',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Exige validação de MIME em uploads',

  rules: [
    {
      id: 'R32_MIME_SNIFFING',
      name: 'MIME Sniffing Detection',
      severity: 'WARNING',

      check: (filePath, content) => {
        const violations = [];
        const pattern = /upload\s*\((?:(?!fileFilter|mimetype|allowedTypes))/g;
        let match;

        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          const line = content.split('\n')[lineNumber - 1];
          if (line && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

          violations.push({
            file: filePath, line: lineNumber, rule: 'R32_MIME_SNIFFING',
            message: 'Upload sem validação de MIME type - MIME Sniffing vulnerável',
            severity: 'WARNING', code: match[0].substring(0, 40),
          });
        }
        return violations;
      },
    },
  ],
};
