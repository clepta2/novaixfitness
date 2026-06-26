# Webhooks Asaas - Teste com Ngrok

## Pré-requisitos

1. Backend rodando localmente
2. Conta no Asaas (sandbox ou produção)
3. Token de webhook configurado no `.env`

## Passo 1: Iniciar o Backend

```bash
cd backend
npm run dev
```

O backend roda em `http://localhost:3000` por padrão.

## Passo 2: Instalar e Iniciar Ngrok

### Instalar Ngrok
```bash
# Windows (via chocolatey)
choco install ngrok

# Ou baixe em: https://ngrok.com/download
```

### Configurar (primeira vez)
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### Iniciar Ngrok
```bash
ngrok http 3000
```

O Ngrok vai gerar uma URL pública como:
```
https://abc123.ngrok-free.app
```

**Importante:** Anote essa URL. Ela muda a cada reinício (a menos que tenha plano pago).

## Passo 3: Configurar Webhook no Asaas

1. Acesse o painel do Asaas
2. Va em **Configurações** → **Webhooks**
3. Clique em **Novo Webhook**
4. Configure:
   - **URL:** `https://sua-url.ngrok-free.app/webhooks/asaas`
   - **Events:** Selecione todos os eventos de pagamento
   - **Token:** O mesmo valor do `ASAAS_WEBHOOK_TOKEN` no `.env`
5. Salve

## Passo 4: Testar

### Teste automático
```bash
cd backend
node scripts/test-webhook.js https://sua-url.ngrok-free.app
```

### Teste manual via Asaas
1. No painel do Asaas, va em **Cobranças**
2. Crie uma cobrança de teste
3. Confirme o pagamento
4. Verifique os logs no terminal do backend

### Teste com curl
```bash
curl -X POST https://sua-url.ngrok-free.app/webhooks/asaas \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: SEU_TOKEN" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_test_001",
      "customer": "cus_test_001",
      "value": 79.90,
      "status": "RECEIVED",
      "billingType": "PIX"
    }
  }'
```

## Passo 5: Verificar Logs

No terminal do backend, você deve ver:
```
📨 Webhook Asaas recebido: PAYMENT_RECEIVED
✅ Pagamento confirmado para user: <user_id>
```

## Variáveis de Ambiente (.env)

```env
# Asaas
ASAAS_API_KEY=sua_chave_api
ASAAS_ENV=sandbox
ASAAS_WEBHOOK_TOKEN=token_secreto_para_verificacao
```

## Eventos Tratados

| Evento | Ação |
|--------|------|
| PAYMENT_RECEIVED | Ativa assinatura do usuário |
| PAYMENT_CREATED | Registra pagamento no banco |
| PAYMENT_UPDATED | Atualiza status do pagamento |
| PAYMENT_OVERDUE | Marca como atrasado |
| PAYMENT_DELETED | Marca como deletado |
| PAYMENT_REFUNDED | Cancela assinatura |
| SUBSCRIPTION_CREATED | Cria assinatura no banco |
| SUBSCRIPTION_UPDATED | Atualiza status |
| SUBSCRIPTION_DELETED | Cancela assinatura |
| SUBSCRIPTION_INACTIVATED | Desativa assinatura |
| SUBSCRIPTION_REACTIVATED | Reativa assinatura |

## Troubleshooting

### Erro 401 "Token inválido"
- Verifique se `ASAAS_WEBHOOK_TOKEN` no backend é o mesmo configurado no Asaas

### Webhook não chega
- Verifique se o Ngrok está rodando
- Confirme a URL no painel do Asaas
- Verifique se a porta 3000 está correta

### Erro de conexão
- O Ngrok pode ter expirado (reinicie)
- Verifique se o backend está rodando

## Produção

Para produção, use uma URL fixa (Vercel, Railway, ou servidor próprio) em vez do Ngrok.

```env
ASAAS_ENV=production
```

E configure a URL de webhook no Asaas para sua produção.
