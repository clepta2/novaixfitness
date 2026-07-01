// Regras 45-47: Camada Humana e Processos
// Verificáveis no código de configuração e middlewares

module.exports = {
  name: 'Human & Process Security',
  rules: [
    // R45: Acesso direto ao banco proibido
    {
      id: 'R45',
      check: (fp, content) => {
        if (fp.includes('.env') || fp.includes('config')) {
          if (content.includes('DATABASE_URL') && content.includes('password') && !content.includes('readonly')) {
            return { msg: 'DATABASE_URL com senha completa em config. Use credenciais de só leitura quando possível', severity: 'WARNING' };
          }
        }
        return null;
      },
    },
    // R46: Contas compartilhadas
    {
      id: 'R46',
      check: (fp, content) => {
        // Excluir emails de suporte legítimos
        const legitimateEmails = ['suporte@', 'support@', 'noreply@', 'no-reply@', 'admin@'];
        const isLegitimate = legitimateEmails.some(e => content.includes(e));

        if (content.includes('admin@') || content.includes('suporte@') || content.includes('generic@')) {
          // Se for email de suporte legítimo, não bloquear
          if (isLegitimate && !content.includes('generic@')) {
            return null;
          }
          return { msg: 'E-mails genéricos detectados. Cada usuário deve ter conta individual', severity: 'WARNING' };
        }
        return null;
      },
    },
    // R47: Validação de identidade em helpdesk
    {
      id: 'R47',
      check: (fp, content) => {
        if (fp.includes('auth') || fp.includes('reset') || fp.includes('recovery')) {
          if (content.includes('reset') && !content.includes('verify') && !content.includes('validate') && !content.includes('2fa')) {
            return { msg: 'Reset de senha deve exigir verificação de identidade além da senha', severity: 'WARNING' };
          }
        }
        return null;
      },
    },
  ],
};
