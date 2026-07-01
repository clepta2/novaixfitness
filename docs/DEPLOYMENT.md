# Guia de Deploy - NOVAIX FITNESS

## Visao Geral

O deploy e automatizado via GitHub Actions com os seguintes fluxos:

```
PR → Preview Build → Preview Deploy
Push to main → CI Tests → Docker Build → Server Deploy
Tag v* → Release → EAS Build → App Store/Play Store
```

## Configuracao Inicial

### 1. Secrets do GitHub

Adicione os seguintes secrets no GitHub (Settings → Secrets → Actions):

**Expo/EAS:**
```
EXPO_TOKEN=seu_token_expo
```

**Docker Hub:**
```
DOCKERHUB_USERNAME=seu_usuario
DOCKERHUB_TOKEN=seu_token
```

**App Store (iOS):**
```
APPLE_ID=seu_apple_id
APPLE_ASC_APP_ID=seu_asc_app_id
APPLE_TEAM_ID=seu_team_id
APPLE_APP_SPECIFIC_PASSWORD=senha_app_especifica
```

**Play Store (Android):**
```
GOOGLE_SERVICE_ACCOUNT_KEY=conteudo_json_chave
```

**Servidor:**
```
SERVER_HOST=seu_servidor.com
SERVER_USER=root
SERVER_SSH_KEY=chave_ssh_privada
```

**Codecov:**
```
CODECOV_TOKEN=seu_token_codecov
```

### 2. Configurar EAS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure
```

### 3. Configurar Supabase

```bash
# Criar tabelas de analytics
# Executar migrations em supabase/migrations/
```

## Fluxos de Deploy

### Preview (PR)

Quando um PR e criado para `main` ou `develop`:

1. **Pre-build Checks** - Lint + Testes
2. **EAS Build** - Build de preview (APK/IPA interno)
3. **Expo Update** - Publica update para testadores

### Production (Push to main)

Quando codigo e mergeado na `main`:

1. **Frontend Tests** - Testes unitarios + lint
2. **Backend Tests** - Testes do backend
3. **Docker Build** - Build da imagem Docker
4. **Server Deploy** - Deploy no servidor via SSH
5. **Health Check** - Verificacao de saude da API

### Release (Tag v*)

Quando uma tag e criada:

1. **Create Release** - Cria release no GitHub
2. **EAS Build** - Build de producao (iOS + Android)
3. **Submit** - Envia para App Store e Play Store

## Comandos Manuais

### Build

```bash
# Build de desenvolvimento (simulador/emulador)
npm run build:ios:dev
npm run build:android:dev

# Build de preview (teste interno)
npm run build:ios:preview
npm run build:android:preview

# Build de producao
npm run build:ios:prod
npm run build:android:prod

# Build completo
npm run build:all:prod
```

### Submit

```bash
# Enviar para lojas
npm run submit:ios
npm run submit:android
npm run submit:all
```

### Updates (OTA)

```bash
# Atualizacao OTA
npm run update:preview
npm run update:prod
```

### Backend

```bash
# Deploy backend
npm run deploy:backend

# Rebuild e deploy
npm run deploy:backend:build
```

## Ambientes

### Development
- Build com debugging habilitado
- Simulador/emulador
- API de teste

### Preview
- Build para teste interno
- Distribuicao via link
- API de staging

### Production
- Build otimizado
- App Store/Play Store
- API de producao

## Monitoramento

### Sentry
- Erros automaticos
- Performance monitoring
- Release tracking

### Analytics
- Eventos de usuario
- Metricas de engajamento
- Cohort analysis

### Health Check
- `/health` - Status da API
- `/api-docs` - Documentacao Swagger

## Rollback

### Backend
```bash
# Rollback para versao anterior
docker-compose -f backend/docker-compose.yml down
docker-compose -f backend/docker-compose.yml up -d novaix-backend:previous
```

### App
- Publicar OTA update com versao anterior
- Ou submeter build anterior para lojas

## Troubleshooting

### Build falhou no EAS
```bash
# Verificar logs
eas build:list
eas build:view <build-id>

# Limpar cache
eas build --clear-cache
```

### Deploy falhou no servidor
```bash
# SSH no servidor
ssh root@seu-servidor

# Verificar containers
docker ps
docker logs novaix-backend

# Reiniciar
cd /opt/novaix-fitness
docker-compose restart
```

### Submit rejeitado nas lojas
- Verificar rejection reasons no App Store Connect
- Verificar track no Google Play Console
- Corrigir e resubmit
