// ============================================
// REGRA 37: LOCKFILE SYNC
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * OBJETIVO: Verificar sincronia entre package.json e lockfile.
 */

module.exports = {
  name: 'Lockfile Sync Check',
  version: '1.0.0',
  severity: 'WARNING',
  description: 'Verifica se lockfile existe',

  rules: [
    {
      id: 'R37_LOCKFILE',
      name: 'Lockfile Sync Check',
      severity: 'WARNING',

      check: (filePath, content) => {
        if (!filePath.endsWith('package.json')) return [];

        const violations = [];
        const fs = require('fs');
        const path = require('path');

        const dir = path.dirname(filePath);
        const hasLock = fs.existsSync(path.join(dir, 'package-lock.json'));
        const hasYarnLock = fs.existsSync(path.join(dir, 'yarn.lock'));

        if (!hasLock && !hasYarnLock) {
          violations.push({
            file: filePath, line: 0, rule: 'R37_LOCKFILE',
            message: 'package.json sem lockfile. Rode npm install ou yarn install',
            severity: 'WARNING', code: 'Sem package-lock.json ou yarn.lock',
          });
        }
        return violations;
      },
    },
  ],
};
