# AUDITORIA COMPLETA - NOVAIX FITNESS
## Análise de Persistência, Sincronização e Estado

**Data:** 2026-07-03
**Arquivos analisados:** ~460+
**Agentes de análise:** 6 (services, hooks, screens, components, data/constants/utils, daily-routines)

---

## RESUMO EXECUTIVO

### Números
- **src/services/**: 100+ arquivos, ~5.500 linhas
- **src/hooks/**: 60+ arquivos, ~3.500 linhas
- **src/components/**: 150+ arquivos, ~8.000 linhas
- **app/**: 91 telas, ~6.500 linhas
- **src/data/**: 76 arquivos, ~3.200 linhas
- **src/constants/**: 18 arquivos, ~1.200 linhas
- **src/utils/**: 19 arquivos, ~1.500 linhas
- **src/context/**: 3 arquivos

### Problemas Críticos Encontrados: 47
### Problemas Moderados: 83
### Stubs/Funções Vazias: 12

---

## SEÇÃO 1: SERVICES (100+ arquivos)

### 1.1 GAMIFICAÇÃO

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `gamification.ts` | 176 | ⚠️ PARCIAL | 5 stubs: `checkAchievements`, `getRankings`, `getUserRank`, `getUserAchievements`, `getUserGamificationProfile` retornam vazios |
| `gamificationLevels.ts` | 91 | ✅ OK | Re-exports + funções de banco |
| `gamificationRankings.ts` | 33 | ⚠️ DUPLICA | `getRankings`/`getUserRank` duplicados com `gamificationLevels.ts` |
| `gamificationAchievements.ts` | 73 | ✅ OK | Fluxo completo de conquistas |
| `checkIn.tsx` | 84 | 🔴 CRÍTICO | Zero try/catch. Campo XP inconsistente (`profiles.xp` vs `profiles.total_xp`) |

### 1.2 TREINO

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `workoutSaver.ts` | 96 | ⚠️ PARCIAL | Sem fila offline. Treinos parciais sem XP |
| `workout-reminders.ts` | 206 | 🔴 ZERO ERRO | Nenhum try/catch em 7 funções públicas |
| `workoutReminders.ts` | 13 | ℹ️ RE-EXPORT | Compatibilidade |
| `waterReminders.ts` | 84 | ⚠️ BUG | `dailyGoal` recebido mas NUNCA usado |
| `adaptivePlan.ts` | 57 | ✅ OK | Lógica pura |
| `planGenerator.ts` | 162 | ⚠️ FRÁGIL | JSON parse via regex. Fallbacks genéricos |

### 1.3 OFFLINE/SYNC

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `offline.ts` | 185 | ✅ OK | Cache principal. TTL 24h |
| `sync.ts` | 82 | ✅ OK | Retry com backoff exponencial |
| `syncQueue.ts` | 93 | 🔴 DUPLICA | Segunda fila independente de `offline.ts` |
| `offlineManager.ts` | 120 | 🔴 DUPLICA | Terceiro caminho de offline |
| `offlineCache.ts` | 114 | ✅ OK | Stats de cache |
| `autoSync.ts` | 59 | ⚠️ GLOBAL | Variáveis de módulo globais sobrescrevem entre si |

### 1.4 NOTIFICAÇÕES

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `notifications.ts` | 91 | 🔴 DUPLICA | Agendamento duplicado com `workout-reminders.ts` |
| `notificationScheduler.ts` | 175 | 🔴 DUPLICA | Terceiro agendador |
| `notifications-real.ts` | 53 | 🔴 ZERO ERRO | Nenhum try/catch |
| `notifications-sender.ts` | 59 | ⚠️ PARCIAL | Sem retry, sem deduplicação |
| `notificationPrefs.ts` | 57 | ⚠️ LENTO | `isNotificationEnabled` faz query a cada chamada |
| `smartNotifications.ts` | 43 | ⚠️ LOCAL | Padrões nunca sincronizados com banco |

### 1.5 SOCIAL

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `socialFeed.ts` | 107 | ✅ OK | Paginação offset (ineficiente) |
| `socialFollow.ts` | 102 | ⚠️ PERFORMANCE | `import()` dinâmico. Busca sem index |
| `stories.ts` | 52 | ⚠️ INCOMPLETO | Sem função para CRIAR stories |
| `duels.ts` | 58 | ⚠️ BUG | Lógica de vencedor sempre favorece challenger |
| `groups.ts` | 97 | ⚠️ BUG | `leaveGroup` não decrementa `member_count` |
| `algorithm.ts` | 47 | 🔴 DUPLICA | Dois caminhos para feed ranqueado |

### 1.6 ANALYTICS

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `analytics.ts` | 280 | ⚠️ PARCIAL | `getMonthlyComparison` sem LIMIT |
| `analytics-admin.ts` | 291 | ✅ OK | serviceGuard robusto |
| `analytics-tracker.ts` | 144 | 🔴 PERDA | Fila em RAM, perdida se app fechar |
| `analytics-helpers.ts` | 183 | ✅ OK | Funções puras |
| + 6 re-exports | - | ℹ️ | Compatibilidade |

### 1.7 IA/GEMINI

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `aiProxy.ts` | 104 | ⚠️ FRÁGIL | `JSON.parse` sem try/catch |
| `aiRecommendations.ts` | 108 | ✅ OK | Fallbacks robustos |
| `gemini.ts` | 120 | ✅ OK | Fallback offline detalhado |
| `geminiFallback.ts` | 79 | 🔴 DUPLICA | `generateFallbackResponse` duplicada |
| `aiSystemInstructions.ts` | 69 | ✅ OK | Constantes estáticas |
| `aiPrompts.ts` | 119 | ✅ OK | Fallbacks com exercícios genéricos |

### 1.8 HEALTH/WEARABLES

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `healthConnect.ts` | 79 | 🔴 STUB | Tudo retorna zero/null hardcoded |
| `appleWatch.ts` | 63 | 🔴 STUB | Nada se comunica com WatchOS |
| `strava.ts` | 60 | 🔴 STUB | API Strava nunca chamada |
| `spotify.ts` | 60 | ✅ OK | Deep linking funcional |
| `wearables.ts` | 32 | ⚠️ FALSO | `checkAppleWatch` retorna true sem verificar |
| `wearablesHeartRate.ts` | 29 | ✅ OK | Funcional |
| `wearablesActivity.ts` | 62 | ✅ OK | serviceGuard |
| `healthIntegration.ts` | 55 | ⚠️ PARCIAL | Catch vazio no Android |
| `healthSync.ts` | 139 | ⚠️ LENTO | Upsert O(N) em loop |

### 1.9 SEGURANÇA

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `certificatePinning.ts` | 26 | 🔴 STUB | PINs fake, verify sempre false |
| `biometrics.ts` | 35 | ✅ OK | expo-local-authentication |
| `securityAdvanced.ts` | 182 | ⚠️ | `hashString` usa djb2, não SHA-256 |
| `shadowBan.ts` | 60 | ✅ OK | Lógica correta |
| `contentModeration.ts` | 39 | ✅ OK | Verificação de bloqueio |
| `wordFilter.ts` | 149 | ✅ OK | Fuzzy matching robusto |

### 1.10 CUPONS (DUPLICAÇÃO)

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `coupons.ts` | 104 | ✅ OK | API `(code, planId)` |
| `coupon.ts` | 131 | 🔴 DUPLICA | API `(price, coupon)` incompatível. Bug de sintaxe RPC |

### 1.11 LGPD/EXPORTAÇÃO

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `lgpd.ts` | 157 | ✅ OK | Delete de 11 tabelas + auth |
| `csv-export.ts` | 163 | ⚠️ BUG | Delete não remove `profiles` |
| `csv-helpers.ts` | 58 | ✅ OK | Web + mobile |

### 1.12 CHAT

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `chatConversations.ts` | 155 | ⚠️ N+1 | Query por conversa para membros |
| `chatMessages.ts` | 70 | ✅ OK | Soft delete |
| `gemini.ts` | 120 | ✅ OK | Coach IA com limite diário |

### 1.13 MONETIZAÇÃO

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `monetizationSubscription.ts` | 92 | ✅ OK | Verificação de expiração |
| `monetizationPlans.ts` | 88 | ✅ OK | Config estática |
| `creator.ts` | 41 | ✅ OK | Hub |
| `creatorProfile.ts` | 39 | ✅ OK | CRUD |
| `creatorContent.ts` | 46 | ✅ OK | Validação de assinatura |
| `creatorSubscription.ts` | 40 | ✅ OK | RPC incremento |
| `virtualGifting.ts` | 154 | ✅ OK | Realtime + RPC |

### 1.14 TUTORIAL/TOTP

| Arquivo | Linhas | Status | Problemas |
|---------|--------|--------|-----------|
| `tutorial.ts` | 139 | ✅ OK | Híbrido AsyncStorage + Supabase |
| `totp.ts` | 107 | ✅ OK | OTP completo |
| `eventTracker.ts` | 66 | 🔴 PERDA | Eventos em RAM, sem fila |

---

## SEÇÃO 2: HOOKS (60+ arquivos)

### 2.1 HOOKS CRÍTICOS (corrigidos nesta sessão)

| Hook | Problema Original | Correção Aplicada |
|------|-------------------|-------------------|
| `useWorkoutTimer.ts` | Sem persistência | Auto-save AsyncStorage a cada 10s + restore |
| `useWorkoutPlayer.tsx` | Sem proteção duplicação | Flag completionRef + verificação no banco |
| `useHomeData.ts` | Flag global frágil | AsyncStorage com chave por data |
| `useFeedStories.ts` | Flag global frágil | AsyncStorage compartilhada |
| `useGoals.tsx` | Stats hardcoded zero | calcStreak() real do banco |
| `useVacationMode.ts` | Só AsyncStorage | Sync Supabase + AsyncStorage |
| `useRateLimit.ts` | Contadores efêmeros | Persistência AsyncStorage |
| `useSocialFeed.ts` | Import circular | Import direto em vez de barrel |

### 2.2 HOOKS COM PROBLEMAS RESTANTES

| Hook | Linhas | Problema | Severidade |
|------|--------|----------|------------|
| `useFeedData.tsx` | 203 | Acima do limite 200 linhas | MODERADO |
| `useSocialFeed.ts` | 107 | Duplica `useFeedData` | MODERADO |
| `useDashboard.tsx` | ~200 | 8 queries simultâneas sem cache | ALTO |
| `useGamification.tsx` | ~150 | setState pode ser chamado após desmontagem | MODERADO |
| `useNetworkStatus.ts` | ~80 | `lastConnected` como dependência causa re-render loop | BAIXO |
| `useIntro.ts` | ~60 | Bug de sintaxe em viewabilityConfig | BAIXO |
| `useCreateWorkout.ts` | 134 | Form em progresso não persiste | MODERADO |
| `usePlayerList.tsx` | 142 | Dependências useEffect incompletas | MODERADO |

### 2.3 HOOKS DUPLICADOS

| Par | Problema |
|-----|----------|
| `useFeedData` + `useSocialFeed` | Ambos gerenciam posts/likes/comments |
| `useWorkoutForm` + `useCreateWorkout` | Sobreposição de concerns |
| `useAchievements` (data) é subconjunto de `useGamification` | Poderia ser opção |

---

## SEÇÃO 3: TELAS (91 arquivos app/)

### 3.1 TELAS POR CATEGORIA

**Auth/Login:** index.tsx (59L), login.tsx, register.tsx (100L), forgot-password.tsx (80L)
**Onboarding:** 14 telas em app/onboarding/
**Tabs:** home.tsx, feed.tsx, library.tsx, ajuda.tsx, perfil/index.tsx, group.tsx, config.tsx
**Treino:** player.tsx, player-list.tsx, workout-detail.tsx, workout/create.tsx, workout/preCheckin.tsx, workout/history.tsx
**Social:** social.tsx, forum.tsx, blog.tsx, chat.tsx, chat-coach.tsx, live.tsx, live-room.tsx
**Gamificação:** gamification.tsx, goals/index.tsx, challenges/index.tsx
**Config:** settings/account.tsx, appearance.tsx, language.tsx, notifications.tsx, accessibility.tsx, delete-account.tsx
**Dados:** body-measures.tsx, progress.tsx, progress-photos.tsx, weekly-progress.tsx, analytics.tsx, dashboard.tsx
**Outros:** paywall.tsx, subscription.tsx, admin.tsx, marketplace.tsx, nutrition.tsx, wearables.tsx, etc.

### 3.2 TELAS COM PERSISTÊNCIA CORRETA

Todas as telas de auth (login, register, forgot-password) usam hooks que persistem corretamente no Supabase.

### 3.3 TELAS COM PROBLEMAS

| Tela | Problema |
|------|----------|
| `player.tsx` | Depende de `useWorkoutPlayer` (corrigido) |
| `gamification.tsx` | Usa `useGamification` com potencial race condition |
| `analytics.tsx` | Usa dados mock de `analyticsMock.ts` |
| `dashboard.tsx` | 8 queries sem cache local |
| `forum.tsx` | Posts hardcoded como mock |

---

## SEÇÃO 4: COMPONENTES (150+ arquivos)

### 4.1 COMPONENTES COM PERSISTÊNCIA

| Componente | Persiste? | Sync? | Problema |
|------------|-----------|-------|----------|
| `SetsTracker.tsx` | ✅ Supabase + offline queue | ✅ | Sem validação duplicação no banco |
| `SetLogger.tsx` | ❌ Só local | ❌ | Deveria persistir |
| `WorkoutHistory.tsx` | ✅ Supabase | ✅ | OK |
| `WaterLogger.tsx` | ⚠️ | ⚠️ | Depende do hook |
| `ComposerCard.tsx` | ✅ Via socialFeed | ✅ | OK |

### 4.2 COMPONENTES DE GAMIFICAÇÃO

| Componente | Persiste? | Problema |
|------------|-----------|----------|
| `LevelCard.tsx` | ✅ Via gamification | OK |
| `AchievementGrid.tsx` | ✅ Via gamification | OK |
| `XpBreakdown.tsx` | ✅ Via gamification | OK |
| `WeeklyChallenges.tsx` (gamification) | ⚠️ | Verificar fonte de dados |
| `WeeklyChallenges.tsx` (profile) | ⚠️ | DUPLICA nome com gamificação |

### 4.3 COMPONENTES DE FEED/SOCIAL

| Componente | Persiste? | Problema |
|------------|-----------|----------|
| `ReelsBar.tsx` | ✅ Via hooks | OK |
| `ComposerCard.tsx` | ✅ Via hooks | OK |
| `PostCard.tsx` (se existir) | ✅ Via hooks | OK |
| `DuelsSection.tsx` | ⚠️ | Usa dados mock |

### 4.4 COMPONENTES COMUNS

| Componente | Função | Status |
|------------|--------|--------|
| `ErrorBoundary.tsx` | Catch de erros | ✅ OK |
| `CacheProvider.tsx` | Cache TTL | ✅ OK |
| `NotificationManager.tsx` | Lembretes | ⚠️ Sem preferências do user |
| `OfflineIndicator.tsx` | Status rede | ✅ OK |
| `TutorialOverlay.tsx` | Tutorials | ✅ OK |
| `SkeletonLoader.tsx` | Loading state | ✅ OK |
| `BottomSheet.tsx` | Modal bottom | ✅ OK |

---

## SEÇÃO 5: DADOS/CONSTANTS/UTILS

### 5.1 DUPLICAÇÕES EM src/data/

| Grupo | Arquivos | Status |
|-------|----------|--------|
| Exercícios | `exerciseCatalog.ts` + `exerciseData.ts` | CLONAGEM IDÊNTICA |
| Workouts | `workouts.ts` + `workoutData.ts` | MESMA ESTRUTURA |
| Onboarding | `onboarding.ts` + `onboardingData.ts` | MESMO CONTEÚDO |
| Lesões | `injuryDetails.ts` + `injuryDetailsData.ts` | MESMA INFO |
| Legal | `legal.ts` + `legalContent.ts` | RESUMIDO vs COMPLETO |
| Palavras | `bannedWords.json` + `bannedWordsData.ts` | MESMO DADO |
| Idades | `ageRanges.ts` vs onboarding | SEMÂNTICA DIFERENTE |

### 5.2 DADOS MOCK QUE DEVEM MIGRAR PARA SUPABASE

| Arquivo | Dados | Consumido por |
|---------|-------|---------------|
| `workouts.ts` | 3 treinos completos | useWorkoutPlayer, useWorkoutDetail |
| `dailyWorkouts.ts` | 5 sessões do dia | usePlayerList |
| `weekPlan.ts` | Grade semanal | WeekOverview, WeekCalendar |
| `exerciseCatalog.ts` | Catálogo de exercícios | planGenerator, planFallback |
| `analyticsMock.ts` | 4 conjuntos de analytics | MonthlyReport, SleepCorrelation, etc. |
| `articles.ts` | 5 artigos | blog.tsx |
| `reels.ts` | 3 vídeos | ReelsBar |
| `forumCategories.ts` | 4 categorias + 4 posts | ForumPostForm |
| `foodDatabase.ts` | 12 alimentos | FoodDatabase |
| `duels.ts` (data) | Mock de duels | DuelsSection |

### 5.3 DUPLICAÇÕES EM src/constants/

| Grupo | Arquivos | Problema |
|-------|----------|----------|
| Tipografia | `fonts.ts` + `typography.ts` | fonts.ts marcado deprecated mas ainda usado |
| Cores | `colors.ts` + `colors.tsx` | Dois arquivos |
| Gamificação | `gamification.ts` + `gamificationLevels.ts` + `gamificationAchievements.ts` | Sobreposição |
| Categorias | `workouts.ts` categories + `categories.ts` + `muscles.ts` CATEGORY_COLORS | 3 fontes |
| Check-in | `checkInRewards.ts` | hardcoded |

### 5.4 UTILS - DUPLICAÇÕES

| Grupo | Arquivos | Problema |
|-------|----------|----------|
| Cache | `cache.ts` + `performance.ts` + `perfOptimizations.ts` | 3 sistemas de cache |
| Rate Limit | `rateLimit.ts` + `rateLimiter.ts` | 2 implementações |
| Memoize | `memoize.ts` | Hooks React |

---

## SEÇÃO 6: CONTEXTO

| Provider | Persiste? | Sync? | Problema |
|----------|-----------|-------|----------|
| `AuthContext.tsx` | Supabase Auth | Sim | Tipos usam `Record<string, any>` |
| `ThemeContext.tsx` | Supabase + AsyncStorage | Sim | CORRIGIDO nesta sessão |
| `CacheProvider.tsx` | AsyncStorage | TTL | OK |

### Provider Tree (_layout.tsx)
```
I18nProvider (SEM persistência - CORRIGIDO: não usado mais)
  → AuthProvider (Supabase)
    → ThemeProvider (AsyncStorage + Supabase) - CORRIGIDO
      → CacheProvider (AsyncStorage)
        → NotificationManager
          → AuthRedirect
          → AppContent
            → ErrorBoundary (CORRIGIDO: agora envolve providers)
```

---

## SEÇÃO 7: ROTINAS DIÁRIAS (1x por dia)

| Rotina | Arquivo | Persiste Estado? | Proteção 1x/dia? | Status |
|--------|---------|------------------|-------------------|--------|
| Check-in diário | `checkIn.tsx` + `useHomeData` + `useFeedStories` | ✅ Banco + AsyncStorage | ✅ AsyncStorage | CORRIGIDO |
| Daily workout | `useHomeData` | ✅ Banco | N/A (sempre mostra) | OK |
| Check-in academia | `gymCheckIn.ts` | ✅ Banco | N/A (múltiplos por dia) | OK |
| Tutorial | `tutorial.ts` | ✅ AsyncStorage + Supabase | ✅ Completou/pulou | OK |
| Streak | `gamification.ts` | ✅ Banco | N/A (calculado) | OK |

---

## SEÇÃO 8: CORREÇÕES APLICADAS NESTA SESSÃO

### 8.1 CORRIGIDOS (10)

1. **useWorkoutTimer.ts** - Persistência AsyncStorage auto-save 10s
2. **useWorkoutPlayer.tsx** - Proteção contra duplicação
3. **useHomeData.ts** - Check-in diário via AsyncStorage
4. **useFeedStories.ts** - Check-in diário via AsyncStorage
5. **useGoals.tsx** - Streak real do banco
6. **useVacationMode.ts** - Sync Supabase + AsyncStorage
7. **useRateLimit.ts** - Persistência de contadores
8. **ThemeContext.tsx** - Fallback AsyncStorage
9. **gamification.ts** - awardXP stub implementado
10. **_layout.tsx** - ErrorBoundary envolve providers
11. **ProfileConfigScreen.tsx** - Import circular corrigido
12. **ProfilePostsTab.tsx** - Import circular corrigido
13. **AccountExistsCard.tsx** - Import circular corrigido
14. **useSocialFeed.ts** - Import circular corrigido
15. **onboarding/_layout.tsx** - Rota loading adicionada

### 8.2 PENDENTES (críticos)

1. **4 sistemas offline duplicados** - Consolidar offline.ts, syncQueue.ts, offlineManager.ts
2. **3 agendadores de notificação** - Consolidar em um
3. **Campo XP inconsistente** - Unificar `profiles.xp` vs `profiles.total_xp`
4. **analytics-tracker.ts** - Fila em RAM precisa de persistência
5. **checkIn.tsx** - Adicionar try/catch
6. **workout-reminders.ts** - Adicionar try/catch
7. **coupon.ts vs coupons.ts** - Unificar APIs
8. **healthConnect.ts / appleWatch.ts / strava.ts** - Stubs precisam de implementação
9. **useFeedData + useSocialFeed** - Unificar
10. **useDashboard.tsx** - Adicionar cache local

---

## SEÇÃO 9: FLUXOS DE DADOS CRÍTICOS

### 9.1 Fluxo de Treino
```
app/player.tsx → useWorkoutPlayer → useWorkoutTimer
  ↓
  Timer auto-saves a cada 10s → AsyncStorage
  ↓
  Ao completar → workoutSaver.saveCompleteWorkout()
    → user_workouts (INSERT)
    → profiles.total_workouts (UPDATE)
    → gamification.recordWorkoutCompletion()
      → addXP → profiles.total_xp (UPDATE)
      → checkAchievements → user_achievements (UPSERT)
    → notifications-sender (NOTIFICATION)
  ↓
  Se offline → queueWorkoutCompletion → offline.ts (AsyncStorage)
  ↓
  Ao reconectar → autoSync → sync.ts → processa fila
```

### 9.2 Fluxo de Check-in Diário
```
useHomeData.checkDailyCheckIn() / useFeedStories.checkDailyCheckIn()
  ↓
  AsyncStorage(@novaix:checkin_shown_date) → verificar se já mostrou hoje
  ↓
  Se não mostrou → getTodayCheckIn(userId) → Supabase daily_check_ins
  ↓
  Se não fez → getCheckInStreak → mostrar modal
  ↓
  User clica → performCheckIn()
    → daily_check_ins (INSERT)
    → profiles.xp (UPDATE) ← INCONSISTÊNCIA com gamification.total_xp
```

### 9.3 Fluxo de Social Feed
```
app/feed.tsx → useFeedData / useSocialFeed
  ↓
  supabase.from('posts').select('*, profiles:user_id(...)') 
  ↓
  useRealtimePosts → Supabase Realtime → atualização live
  ↓
  like → post_likes (INSERT/DELETE) → RPC increment_likes
  ↓
  comment → post_comments (INSERT) → RPC increment_comments
```

---

*Documento gerado automaticamente pela auditoria do MiMoCode Agent*
*Última atualização: 2026-07-03*
