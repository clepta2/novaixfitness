# 💪 NOVAIX FITNESS

App de treinos com IA, gamificação e comunidade — React Native (Expo) + Supabase + Express.

---

## 🚀 Stack

| Camada | Tecnologia |
|--------|------------|
| Mobile | React Native (Expo SDK 56) |
| Routing | Expo Router |
| Backend | Express.js |
| Banco | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email, Google, Apple) |
| IA | Google Gemini |
| Pagamento | Asaas |
| Fontes | Montserrat (títulos), Inter (corpo) |

---

## 📁 Estrutura

```
app/                  ← Telas (máx 200 linhas cada)
  (tabs)/             ← Tabs principais (Home, Feed, Library, Perfil, Ajuda)
  onboarding/         ← Fluxo de onboarding (7 telas)
src/
  components/         ← Componentes reutilizáveis (25+ pastas)
  constants/          ← COLORS, SPACING, SHADOWS, FONTS
  context/            ← AuthContext, ThemeContext
  data/               ← Dados mock e constantes
  helpers/            ← Utilitários (CPF, auth, navigation)
  hooks/              ← Custom hooks (timer, profile, offline)
  services/           ← Lógica de negócio (43 serviços)
  styles/             ← StyleSheets centralizados
  utils/              ← Animações, responsive
backend/              ← API Express (auth, payments, webhooks, admin)
landing/              ← Landing page HTML
admin/                ← Painel admin (Vite + React)
supabase/
  migrations/         ← Migrations SQL ordenadas por timestamp
  seed.sql            ← Dados iniciais
  config.toml         ← Config local
```

---

## ⚡ Setup Rápido

### 1. Instalar dependências
```bash
npm install
cd backend && npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Preencher: SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, ASAAS_API_KEY
```

### 3. Configurar banco de dados
Execute as migrations em ordem no Supabase SQL Editor:
```
supabase/migrations/20260601000000_create_base_tables.sql
supabase/migrations/20260601010000_create_detailed_tables.sql
... (demais arquivos em ordem)
```

### 4. Rodar o app
```bash
# App mobile
npx expo start

# Backend (em outro terminal)
cd backend && node src/server.js
```

---

## 🧪 Testes

```bash
npm test              # Rodar todos os testes
npm run test:watch    # Watch mode
npm run test:coverage # Com cobertura
```

---

## 📱 Features

- **🏋️ Treinos**: Timer inteligente, exercícios guiados, vídeos YouTube
- **🤖 Coach IA**: Chat com Gemini para dicas personalizadas
- **🏆 Gamificação**: XP, níveis, conquistas, streak, leaderboard
- **👥 Comunidade**: Feed social, desafios, compartilhamento
- **📊 Analytics**: Dashboard, gráficos de evolução, medidas corporais
- **🔔 Notificações**: Push, lembretes de treino, streak em risco
- **🌙 Tema**: Claro/Escuro/Automático
- **📴 Offline**: Treinos e dados salvos localmente
- **💳 Pagamentos**: Integração Asaas (PIX, cartão, boleto)
- **🔒 Segurança**: Rate limiting, 2FA, LGPD compliance

---

## 📄 Documentação Adicional

- [AUTH_SETUP.md](AUTH_SETUP.md) — Configuração de autenticação
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) — Setup do banco de dados
- [PAYMENT_SETUP.md](PAYMENT_SETUP.md) — Integração de pagamentos
- [STORE_CHECKLIST.md](STORE_CHECKLIST.md) — Checklist para publicação nas lojas
- [CHANGELOG.md](CHANGELOG.md) — Histórico de alterações

---

## 📝 Licença

Projeto proprietário — veja [LICENSE](LICENSE) para detalhes.
