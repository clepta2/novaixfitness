# Configuração do Gateway de Pagamento - Asaas

## 1. Criar conta no Asaas

1. Acesse https://www.asaas.com
2. Crie uma conta (gratuita para testes no Sandbox)
3. Após aprovação, gere uma API Key em: Configurações > API

## 2. Configurar variáveis de ambiente

### Backend (.env)

```env
# Sandbox (para testes)
ASAAS_ENV=sandbox
ASAAS_API_KEY=sua_chave_api_aqui

# Produção (após aprovação)
ASAAS_ENV=production
ASAAS_API_KEY=sua_chave_api_aqui

# Token para validação de webhooks
ASAAS_WEBHOOK_TOKEN=token_aleatorio_fortemente
```

### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

## 3. Configurar tabela de pagamentos no Supabase

Execute o SQL em `create-tables.sql` no Supabase SQL Editor:

```sql
-- Copiar e colar o conteúdo de create-tables.sql
-- Inclui: payments, subscriptions, RLS policies, indexes
```

## 4. Configurar Webhooks no Asaas

1. No painel Asaas: Configurações > Webhooks
2. Adicione a URL do seu backend:
   - Produção: `https://seu-dominio.com/webhooks/asaas`
   - Sandbox: Use ngrok - `ngrok http 3000` e copie a URL
3. Selecione os eventos:
   - PAYMENT_RECEIVED
   - PAYMENT_OVERDUE
   - PAYMENT_REFUNDED
   - SUBSCRIPTION_CREATED
   - SUBSCRIPTION_DELETED
4. Configure o header: `asaas-access-token: seu_token_webhook`

## 5. Testar no Sandbox

### Cards de teste (Sandbox)
- Cartão aprovado: `4242 4242 4242 4242`
- Cartão recusado: `4000 0000 0000 0002`
- Qualquer data futura, CVC: `123`

### Pix (Sandbox)
- Use a API para gerar QR Code
- Pague no sandbox do Asaas

### Fluxo de teste
1. Inicie o backend: `cd backend && npm run dev`
2. Inicie o app: `npx expo start`
3. Vá para Paywall
4. Selecione um plano e PIX
5. Copie o código PIX
6. Pague no sandbox do Asaas
7. Webhook atualiza automaticamente o status

## 6. Deploy

### Backend
- Deploy em: Railway, Render, ou Vercel
- Atualize `EXPO_PUBLIC_API_URL` para a URL do backend

### Webhooks
- Configure a URL de produção no Asaas
- Remova o ngrok

### HTTPS
- Obrigatório para webhooks
- Use Let's Encrypt ou certificado SSL

## 7. Planos

| Plano | Preço | Descrição |
|-------|-------|-----------|
| Básico | R$ 49,90/mês | Treinos limitados, suporte email |
| Intermediário | R$ 79,90/mês | Treinos ilimitados, Coach IA |
| Premium | R$ 119,90/mês | Tudo + Nutrição, suporte VIP |

## 8. Estrutura de arquivos

```
backend/
  src/
    services/asaas.js      ← Serviço Asaas API
    routes/payments.js     ← Rotas de pagamento
    routes/webhooks.js     ← Webhooks handler

mobile/
  src/
    services/payment.js    ← Cliente de pagamento
  app/
    paywall.js             ← Tela de pagamento
    subscription.js        ← Gerenciamento assinatura
```

## 9. Segurança

- ✅ API Key do Asaas apenas no backend (nunca no mobile)
- ✅ Webhook token validado em cada requisição
- ✅ RLS no Supabase (usuário só vê seus pagamentos)
- ✅ HTTPS obrigatório em produção
- ✅ Rate limiting no backend
