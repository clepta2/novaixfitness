// Regras 48-50: Sobrevivência e Continuidade
// Verificáveis no código de infraestrutura e configuração

module.exports = {
  name: 'Survival & Continuity',
  rules: [
    // R48: Backup 3-2-1
    {
      id: 'R48',
      check: (fp, content) => {
        if (fp.includes('backup') || fp.includes('deploy') || fp.includes('docker')) {
          if (content.includes('backup') && !content.includes('immutable') && !content.includes('3-2-1')) {
            return { msg: 'Backups devem seguir regra 3-2-1 (3 cópias, 2 mídias, 1 offsite imutável)', severity: 'WARNING' };
          }
        }
        return null;
      },
    },
    // R49: Disaster Recovery (IaC)
    {
      id: 'R49',
      check: (fp, content) => {
        if (fp.includes('docker') || fp.includes('deploy') || fp.includes('terraform')) {
          if (content.includes('deploy') && !content.includes('recover') && !content.includes('restore')) {
            return { msg: 'Deploy deve ter procedimento de disaster recovery documentado', severity: 'WARNING' };
          }
        }
        return null;
      },
    },
    // R50: Chaos Engineering
    {
      id: 'R50',
      check: (fp, content) => {
        if (fp.includes('test') || fp.includes('e2e')) {
          if (content.includes('test') && !content.includes('chaos') && !content.includes('failure') && !content.includes('error')) {
            return { msg: 'Testes devem incluir cenários de falha e caos', severity: 'WARNING' };
          }
        }
        return null;
      },
    },
  ],
};
