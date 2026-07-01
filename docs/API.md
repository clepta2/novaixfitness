# API Reference - NOVAIX FITNESS

## Backend API

### Base URL
```
https://api.novaixfitness.com
```

### Autenticacao
Todas as rotas exigem header `Authorization: Bearer <token>`

### Endpoints

#### Auth
```
POST /api/auth/register     - Registrar usuario
POST /api/auth/login        - Login
POST /api/auth/logout       - Logout
POST /api/auth/refresh      - Refresh token
POST /api/auth/forgot       - Esqueci senha
POST /api/auth/reset        - Redefinir senha
```

#### Users
```
GET    /api/users/me        - Perfil do usuario
PUT    /api/users/me        - Atualizar perfil
DELETE /api/users/me        - Deletar conta
GET    /api/users/:id       - Buscar usuario
```

#### Workouts
```
GET    /api/workouts        - Listar treinos
GET    /api/workouts/:id    - Detalhe do treino
POST   /api/workouts        - Criar treino
PUT    /api/workouts/:id    - Atualizar treino
DELETE /api/workouts/:id    - Deletar treino
POST   /api/workouts/:id/complete - Concluir treino
```

#### Exercises
```
GET    /api/exercises       - Listar exercicios
GET    /api/exercises/:id   - Detalhe do exercicio
POST   /api/exercises       - Criar exercicio
PUT    /api/exercises/:id   - Atualizar exercicio
```

#### Nutrition
```
GET    /api/nutrition/meals    - Listar refeicoes
POST   /api/nutrition/meals    - Registrar refeicao
GET    /api/nutrition/water    - Historico de agua
POST   /api/nutrition/water    - Registrar agua
GET    /api/nutrition/summary  - Resumo nutricional
```

#### Progress
```
GET    /api/progress/weight    - Historico de peso
POST   /api/progress/weight    - Registrar peso
GET    /api/progress/photos    - Fotos de progresso
POST   /api/progress/photos    - Adicionar foto
GET    /api/progress/measurements - Medidas corporais
POST   /api/progress/measurements - Registrar medidas
```

#### Social
```
GET    /api/posts             - Feed de posts
POST   /api/posts             - Criar post
DELETE /api/posts/:id         - Deletar post
POST   /api/posts/:id/like    - Curtir post
GET    /api/posts/:id/comments - Comentarios
POST   /api/posts/:id/comments - Adicionar comentario
POST   /api/users/:id/follow  - Seguir usuario
DELETE /api/users/:id/follow  - Deixar de seguir
```

#### Gamification
```
GET    /api/gamification/profile  - Perfil de gamificacao
GET    /api/gamification/rankings - Rankings
GET    /api/gamification/achievements - Conquistas
POST   /api/gamification/achievements/:id/unlock - Desbloquear conquista
```

#### Subscriptions
```
GET    /api/subscriptions/plans     - Planos disponiveis
GET    /api/subscriptions/current   - Assinatura atual
POST   /api/subscriptions           - Criar assinatura
DELETE /api/subscriptions/:id       - Cancelar assinatura
POST   /api/subscriptions/coupon    - Aplicar cupom
```

#### Notifications
```
GET    /api/notifications       - Listar notificacoes
PUT    /api/notifications/:id   - Marcar como lida
PUT    /api/notifications/read-all - Marcar todas como lidas
POST   /api/notifications/push  - Registrar push token
```

#### Admin
```
GET    /api/admin/users       - Listar usuarios
GET    /api/admin/stats       - Estatisticas
GET    /api/admin/workouts    - Gerenciar treinos
GET    /api/admin/exercises   - Gerenciar exercicios
```

### Webhooks
```
POST /webhooks/payments     - Webhooks de pagamento
POST /webhooks/asaas        - Webhooks Asaas
```

### Rate Limiting
- Default: 100 requests/min
- Auth: 10 requests/min
- Webhooks: 1000 requests/min

### Erros
```json
{
  "error": "Mensagem de erro",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Codigos de Erro
- `AUTH_REQUIRED` - Autenticacao necessaria
- `INVALID_TOKEN` - Token invalido
- `RATE_LIMITED` - Limite de taxa excedido
- `NOT_FOUND` - Recurso nao encontrado
- `VALIDATION_ERROR` - Erro de validacao
- `SERVER_ERROR` - Erro interno do servidor
