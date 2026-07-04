// ============================================
// REGRA 36: DESIGN SYSTEM
// ============================================
// Nível: MÉDIO | Tipo: WARNING

/**
 * OBJETIVO: Verificar uso do design system (COLORS, SPACING).
 */

module.exports = {
  name: 'Design System Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Verifica uso do design system',

  rules: [
    {
      id: 'R36_DESIGN_SYSTEM',
      name: 'Design System Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.includes('src/components/') || filePath.includes('index.js')) return [];

        const violations = [];
        const hasColors = content.includes('COLORS') || content.includes('colors');
        const hasSpacing = content.includes('SPACING') || content.includes('spacing');

        if (!hasColors || !hasSpacing) {
          violations.push({
            file: filePath, line: 0, rule: 'R36_DESIGN_SYSTEM',
            message: 'Componente não usa design system (COLORS/SPACING)',
            severity: 'WARNING', code: `Cores: ${hasColors}, Espaçamento: ${hasSpacing}`,
          });
        }
        return violations;
      },
    },
  ],
};
