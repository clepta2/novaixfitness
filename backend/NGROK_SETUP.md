# Guia de Teste de Webhooks com Ngrok

## O que é Ngrok?

Ngrok cria um túnel público para seu servidor local. Permite que webhooks do Asaas acessem seu backend rodando na sua máquina.

## Pré-requisitos

1. Conta no Asaas (sandbox: https://sandbox.asaas.com)
2. Backend rodando (porta 3000)
3. Ngrok instalado

## Passo 1: Instalar Ngrok

```bash
# Windows (via scoop)
scoop install ngrok

# Windows (via Chocolatey)
choco install ngrok

# Mac
brew install ngrok/ngrok/ngrok

# Linux
sudo snap install ngrok
```

## Passo 2: Configurar Ngrok

```bash
# Criar conta gratuita em https://ngrok.com
# Copiar seu authtoken
ngrok config add-authtoken SEU_AUTHTOKEN
```

## Passo 3: Iniciar Backend

```bash
cd backend
npm run dev
```

## Passo 4: Iniciar Ngrok

```bash
ngrok http 3000
```

O Ngrok vai mostrar algo como:

```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Copie essa URL pública.

## Passo 5: Configurar no Asaas

1. Acesse https://sandbox.asaas.com
2. Vá em **Configurações > Webhooks**
3. Clique em **Adicionar webhook**
4. Cole a URL: `https://abc123.ngrok-free.app/webhooks/asaas`
5. Selecione os eventos:
   - PAYMENT_RECEIVED
   - PAYMENT_CREATED
   - PAYMENT_OVERDUE
   - PAYMENT_REFUNDED
   - SUBSCRIPTION_CREATED
   - SUBSCRIPTION_DELETED
6. Copie o **Token de autenticação**
7. Adicione no `.env` do backend:
   ```
   ASAAS_WEBHOOK_TOKEN=token-copiado
   ```

## Passo 6: Testar Webhooks

### Opção A: Script automático

```bash
cd backend
BACKEND_URL=http://localhost:3000 ASAAS_WEBHOOK_TOKEN=seu-token node test_webhooks.js
```

### Opção B: Via Asaas (sandbox)

1. Crie um cliente de teste no sandbox
2. Crie um pagamento de teste
3. Confirme o pagamento
4. Observe os logs no terminal do backend

### Opção C: Via curl

```bash
# Testar PAYMENT_RECEIVED
curl -X POST http://localhost:3000/webhooks/asaas \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: SEU_TOKEN" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_test123",
      "customer": "cus_test456",
      "value": 79.90,
      "status": "RECEIVED",
      "billingType": "PIX",
      "paymentDate": "2026-06-26T10:00:00Z"
    }
  }'
```

## Passo 7: Verificar Resultados

### No terminal do backend, você deve ver:

```
📨 Webhook Asaas recebido: PAYMENT_RECEIVED
✅ Pagamento confirmado para user: xxx
```

### No banco de dados (Supabase):

1. Tabela `payments`: status deve ser 'RECEIVED'
2. Tabela `profiles`: subscription_status deve ser 'active'

## Eventos para Testar

| Evento | O que acontece |
|--------|----------------|
| PAYMENT_RECEIVED | Pagamento confirmado, assinatura ativada |
| PAYMENT_CREATED | Pagamento registrado no banco |
| PAYMENT_OVERDUE | Status muda para 'overdue' |
| PAYMENT_REFUNDED | Assinatura cancelada, status 'free' |
| SUBSCRIPTION_CREATED | Assinatura criada e ativada |
| SUBSCRIPTION_DELETED | Assinatura cancelada |

## Troubleshooting

### Erro 401 Token inválido
- Verifique se o token no `.env` é o mesmo configurado no Asaas
- Verifique se não há espaços extras

### Webhook não chega
- Verifique se o Ngrok está rodando
- Verifique se a URL no Asaas está correta
- Verifique se a porta 3000 está aberta

### Erro 500 no backend
- Verifique se o Supabase está configurado
- Verifique se as tabelas `payments` e `profiles` existem
- Verifique os logs do backend

## Ambiente de Produção

Para produção:
1. Use a URL real do backend (ex: https://api.novaixfitness.com)
2. Configure o webhook no Asaas produção (https://www.asaas.com)
3. Use HTTPS obrigatório
4. Configure o token de webhook em produção
