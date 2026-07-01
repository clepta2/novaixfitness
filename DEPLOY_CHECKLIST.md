# NOVAIX FITNESS - Checklist de Deploy

## Pré-Deploy

### 1. Supabase
- [ ] Criar bucket `stories` (5MB, image/jpeg, public read)
- [ ] Verificar bucket `posts` existe
- [ ] Rodar `supabase/setup.sql` no SQL Editor
- [ ] Verificar RPC functions: `is_user_blocked`, `log_user_action`, `check_user_rate_limit`
- [ ] Verificar RPC functions: `increment_likes`, `decrement_likes`, `increment_comments`
- [ ] Verificar RPC functions: `get_user_stats`, `buy_coins`, `send_gift`
- [ ] Verificar triggers: `on_post_reaction_change`, `on_auth_user_created`
- [ ] Verificar RLS policies em todas as tabelas novas
- [ ] Verificar moderação rules inseridas

### 2. Variáveis de Ambiente
- [ ] `EXPO_PUBLIC_SUPABASE_URL` configurado
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `EXPO_PUBLIC_API_URL` configurado
- [ ] `EXPO_PUBLIC_SENTRY_DSN` configurado (opcional)
- [ ] `ASAAS_API_KEY` configurado (produção)
- [ ] `ASAAS_WEBHOOK_SECRET` configurado
- [ ] `ENCRYPTION_KEY` configurado

### 3. Storage Buckets
- [ ] Bucket `stories` criado (5MB max, image/jpeg)
- [ ] Bucket `posts` verificado
- [ ] RLS policies para upload/read

### 4. Segurança
- [ ] Rodar `node scripts/enforce-security.js src` sem BLOCKS críticos
- [ ] Verificar console.log fora de __DEV__
- [ ] Verificar arquivos > 200 linhas (warn)
- [ ] Verificar R07 (SQL injection) - OK com Supabase
- [ ] Verificar R15 (fetch timeout) em todas as chamadas

### 5. Build
- [ ] `npm install` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm test` passando
- [ ] `eas build --platform android` sucesso
- [ ] `eas build --platform ios` sucesso

### 6. Testes
- [ ] Fluxo de login completo
- [ ] Fluxo de onboarding
- [ ] Criação de post com imagem
- [ ] Like/comentário em tempo real
- [ ] Chat entre usuários
- [ ] Live de treino
- [ ] Pagamento/assinatura
- [ ] Check-in diário
- [ ] Sistema de reações
- [ ] Sistema de stories

### 7. Monitoramento
- [ ] Sentry configurado (opcional)
- [ ] Analytics events funcionando
- [ ] Audit log gravando ações
- [ ] Trust score atualizando

### 8. Performance
- [ ] Cache de imagens funcionando
- [ ] Lazy loading de telas
- [ ] FlatList otimizada
- [ ] Offline mode funcionando

### 9. Segurança Avançada
- [ ] Rate limiting ativo
- [ ] CORS configurado
- [ ] Headers de segurança
- [ ] Webhook validation (Asaas)
- [ ] Content moderation ativa

### 10. Documentação
- [ ] README.md atualizado
- [ ] CHANGELOG.md com novas features
- [ ] AUTH_SETUP.md verificado
- [ ] SUPABASE_SETUP.md verificado
- [ ] PAYMENT_SETUP.md verificado

## Deploy

### Frontend (EAS Build)
```bash
# Preview
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit
eas submit --platform android
eas submit --platform ios
```

### Backend (Docker)
```bash
# Build
docker compose build

# Deploy
docker compose up -d

# Verificar
docker compose ps
docker compose logs -f
```

### Database (Supabase)
```bash
# Aplicar migrations
supabase db push

# Ou manualmente no SQL Editor
# Copiar cada migration de supabase/migrations/ e rodar na ordem
```

## Pós-Deploy

### Verificações
- [ ] App abre corretamente
- [ ] Login funciona
- [ ] Feed carrega posts
- [ ] Chat funciona em tempo real
- [ ] Pagamentos processam
- [ ] Notificações push funcionam
- [ ] Offline mode funciona
- [ ] Analytics gravando

### Monitoramento
- [ ] Logs do servidor sem erros
- [ ] Audit log gravando ações
- [ ] Trust score atualizando
- [ ] Rate limiting funcionando
- [ ] Webhooks recebendo

### Rollback (se necessário)
```bash
# Frontend
eas build --platform android --profile production
eas submit --platform android

# Backend
docker compose down
docker compose up -d --build

# Database
# Reverter migration manualmente no SQL Editor
```
