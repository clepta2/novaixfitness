# Backend NOVAIX FITNESS

## Stack
- Node.js + Express
- Supabase (banco de dados + auth)
- Helmet (segurança)
- Rate Limiting (anti-spam)

## Setup

```bash
cd backend
npm install
```

## Variáveis de Ambiente

Copie `.env` e preencha:
- `SUPABASE_SERVICE_ROLE_KEY` - Chave do Supabase (Settings > API)
- `ASAAS_API_KEY` - Chave do Asaas (se usar)

## Iniciar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints

### Auth
- `POST /api/auth/signup` - Cadastro
- `POST /api/auth/login` - Login
- `POST /api/auth/reset-password` - Recuperar senha

### Users
- `GET /api/users/profile` - Buscar perfil (auth)
- `PUT /api/users/profile` - Atualizar perfil (auth)
- `POST /api/users/onboarding` - Salvar onboarding (auth)

### Workouts
- `GET /api/workouts` - Listar treinos
- `GET /api/workouts/:id` - Buscar treino
- `POST /api/workouts/:id/complete` - Concluir treino (auth)
- `GET /api/workouts/user/history` - Histórico do usuário (auth)

### Payments
- `POST /api/payments/subscribe` - Criar assinatura (auth)
- `GET /api/payments/status` - Status da assinatura (auth)
- `POST /api/payments/cancel` - Cancelar assinatura (auth)

### Webhooks
- `POST /webhooks/asaas` - Webhook Asaas

## Segurança
- Helmet ativo
- Rate limiting (100 req/15min)
- Autenticação via JWT (Supabase)
- CORS configurado
