# NOVAIX FITNESS - Documentação de Componentes

**Última atualização:** 2026-07-03
**Total de componentes:** 200+

---

## ÍNDICE

1. [Componentes UI Genéricos](#1-componentes-ui-genéricos)
2. [Componentes de Treino](#2-componentes-de-treino)
3. [Componentes de Perfil](#3-componentes-de-perfil)
4. [Componentes de Social/Feed](#4-componentes-de-socialfeed)
5. [Componentes de Gamificação](#5-componentes-de-gamificação)
6. [Componentes de Analytics](#6-componentes-de-analytics)
7. [Componentes de Comum](#7-componentes-de-comum)
8. [Componentes de Auth](#8-componentes-de-auth)
9. [Componentes de Blog](#9-componentes-de-blog)
10. [Componentes de Grupo](#10-componentes-de-grupo)
11. [Hooks](#11-hooks)
12. [Services](#12-services)
13. [Contexts](#13-contexts)

---

## 1. COMPONENTES UI GENÉRICOS

### Button
- **Arquivo:** `src/components/ui/Button.tsx`
- **Props:** `title`, `onPress`, `variant ('primary'|'secondary'|'outline')`, `disabled`, `loading`, `icon`
- **Uso:** Botão principal do app
- **Design System:** Usa COLORS.primary, SPACING, BORDER_RADIUS

### Input
- **Arquivo:** `src/components/ui/Input.tsx`
- **Props:** `label`, `value`, `onChangeText`, `placeholder`, `secureTextEntry`, `error`, `icon`
- **Uso:** Campos de formulário (login, cadastro, etc)

### Card
- **Arquivo:** `src/components/ui/Card.tsx`
- **Props:** `children`, `style`, `onPress`
- **Uso:** Container genérico com borda e sombra

### GlassCard
- **Arquivo:** `src/components/ui/GlassCard.tsx`
- **Props:** `children`, `style`, `blurIntensity`
- **Uso:** Card com efeito glass/blur
- **Design System:** Usa COLORS.surface + blur

### HapticButton
- **Arquivo:** `src/components/ui/HapticButton.tsx`
- **Props:** `onPress`, `children`, `hapticType ('light'|'medium'|'heavy')`
- **Uso:** Botão com feedback háptico

### FloatingCard
- **Arquivo:** `src/components/ui/FloatingCard.tsx`
- **Props:** `children`, `style`, `elevation`
- **Uso:** Card com sombra elevada

### AnimatedGradient
- **Arquivo:** `src/components/ui/AnimatedGradient.tsx`
- **Props:** `colors`, `start`, `end`, `animated`
- **Uso:** Fundo com gradiente animado

### Avatar
- **Arquivo:** `src/components/ui/Avatar.tsx`
- **Props:** `uri`, `name`, `size ('sm'|'md'|'lg')`, `style`
- **Uso:** Foto de perfil com fallback para iniciais

### Badge
- **Arquivo:** `src/components/ui/Badge.tsx`
- **Props:** `count`, `variant ('dot'|'count')`, `color`
- **Uso:** Indicador de notificação

### ProgressBar
- **Arquivo:** `src/components/ui/ProgressBar.tsx`
- **Props:** `progress (0-100)`, `color`, `height`, `animated`
- **Uso:** Barra de progresso

### Modal
- **Arquivo:** `src/components/ui/Modal.tsx`
- **Props:** `visible`, `onClose`, `children`, `title`
- **Uso:** Modal genérico

### BottomSheet
- **Arquivo:** `src/components/ui/BottomSheet.tsx`
- **Props:** `visible`, `onClose`, `children`
- **Uso:** Modal que desliza de baixo

### SearchBar
- **Arquivo:** `src/components/ui/SearchBar.tsx`
- **Props:** `value`, `onChangeText`, `placeholder`, `onClear`
- **Uso:** Barra de busca

### Skeleton
- **Arquivo:** `src/components/ui/Skeleton.tsx`
- **Props:** `width`, `height`, `borderRadius`
- **Uso:** Placeholder de carregamento

### Loading
- **Arquivo:** `src/components/ui/Loading.tsx`
- **Props:** `size`, `color`
- **Uso:** Indicador de carregamento

### EmptyState
- **Arquivo:** `src/components/ui/EmptyState.tsx`
- **Props:** `icon`, `title`, `message`, `actionLabel`, `onAction`
- **Uso:** Estado vazio (lista sem itens)

### Toast
- **Arquivo:** `src/components/ui/Toast.tsx`
- **Props:** (via ToastProvider/useToast)
- **Uso:** Notificação temporária

### FilterBar
- **Arquivo:** `src/components/ui/FilterBar.tsx`
- **Props:** `filters`, `selected`, `onSelect`
- **Uso:** Barra de filtros

### Stepper
- **Arquivo:** `src/components/ui/Stepper.tsx`
- **Props:** `currentStep`, `totalSteps`, `labels`
- **Uso:** Indicador de progresso em etapas

### Timeline
- **Arquivo:** `src/components/ui/Timeline.tsx`
- **Props:** `items[]`, `type ('workout'|'achievement')`
- **Uso:** Linha do tempo

### SwipeableItem
- **Arquivo:** `src/components/ui/SwipeableList.tsx`
- **Props:** `children`, `onDelete`, `onArchive`
- **Uso:** Item com ações ao deslizar

### StarRating
- **Arquivo:** `src/components/ui/StarRating.tsx`
- **Props:** `rating`, `onRate`, `maxStars`, `size`
- **Uso:** Avaliação por estrelas

### PlanCard
- **Arquivo:** `src/components/ui/PlanCard.tsx`
- **Props:** `plan`, `selected`, `onSelect`
- **Uso:** Card de plano de assinatura

### GradientButton
- **Arquivo:** `src/components/ui/GradientButton.tsx`
- **Props:** `title`, `onPress`, `colors`, `disabled`
- **Uso:** Botão com gradiente

### BentoGrid
- **Arquivo:** `src/components/ui/BentoGrid.tsx`
- **Props:** `items[]`, `columns`, `onItemPress`
- **Uso:** Grid estilo Bento

### AnimatedCounter
- **Arquivo:** `src/components/ui/AnimatedCounter.tsx`
- **Props:** `value`, `duration`, `prefix`, `suffix`
- **Uso:** Contador animado

### ProgressRing
- **Arquivo:** `src/components/ui/ProgressRing.tsx`
- **Props:** `progress`, `size`, `color`, `strokeWidth`
- **Uso:** Anel de progresso circular

---

## 2. COMPONENTES DE TREINO

### WorkoutCard
- **Arquivo:** `src/components/workout/WorkoutCard.tsx`
- **Props:** `name`, `duration`, `level`, `category`, `onPress`, `onFavorite`, `isFavorite`
- **Uso:** Home, Library, Feed
- **Persistência:** Não salva diretamente, delega ao hook

### CategoryCard
- **Arquivo:** `src/components/workout/CategoryCard.tsx`
- **Props:** `label`, `icon`, `count`, `color`, `onPress`, `isActive`
- **Uso:** Home, Library

### ExerciseAccordion
- **Arquivo:** `src/components/workout/ExerciseAccordion.tsx`
- **Props:** `exercise`, `isOpen`, `onToggle`
- **Uso:** workout-detail.js

### ExerciseStepCarousel
- **Arquivo:** `src/components/workout/ExerciseStepCarousel.tsx`
- **Props:** `steps[]`
- **Uso:** workout-detail.js

### SetsTracker
- **Arquivo:** `src/components/workout/SetsTracker.tsx`
- **Props:** `exercise`, `onLogSet`
- **Persistência:** Salva em `user_exercise_logs` via Supabase + fila offline
- **Sync:** Usa `useNetworkStatus()` para detectar online/offline

### WorkoutTimer
- **Arquivo:** `src/components/workout/WorkoutTimer.tsx`
- **Props:** `phase`, `timeRemaining`, `totalTime`, `onPause`, `onResume`, `onSkip`
- **Persistência:** Estado gerenciado por `useWorkoutTimer`

### RestOverlay
- **Arquivo:** `src/components/workout/RestOverlay.tsx`
- **Props:** `timeRemaining`, `totalTime`, `onSkip`
- **Uso:** Overlay de descanso entre séries

### WorkoutControls
- **Arquivo:** `src/components/workout/WorkoutControls.tsx`
- **Props:** `phase`, `onStart`, `onPause`, `onResume`, `onStop`
- **Uso:** Controles do player de treino

### WorkoutHistory
- **Arquivo:** `src/components/workout/WorkoutHistory.tsx`
- **Props:** `userId`
- **Persistência:** Carrega de `user_workouts` no Supabase

### WorkoutCardEnhanced
- **Arquivo:** `src/components/ui/WorkoutCardEnhanced.tsx`
- **Props:** `workout`, `onPress`, `onFavorite`
- **Uso:** Versão melhorada do WorkoutCard

---

## 3. COMPONENTES DE PERFIL

### ProfileHeader
- **Arquivo:** `src/components/profile/ProfileHeader.tsx`
- **Props:** `name`, `avatar`, `stats`
- **Uso:** Header do perfil

### ProfileHero
- **Arquivo:** `src/components/profile/ProfileHero.tsx`
- **Props:** `name`, `email`, `memberSince`, `uri`, `onPressAvatar`, `onEditName`, `stats`
- **Uso:** Seção hero do perfil

### StatsGrid
- **Arquivo:** `src/components/profile/StatsGrid.tsx`
- **Props:** `stats[]`
- **Uso:** Grid de estatísticas

### GamificationBar
- **Arquivo:** `src/components/profile/GamificationBar.tsx`
- **Props:** `level`, `xp`, `progress`
- **Uso:** Barra de gamificação no perfil

### AchievementsList
- **Arquivo:** `src/components/profile/AchievementsList.tsx`
- **Props:** `achievements[]`
- **Uso:** Lista de conquistas

### QuickActionsGrid
- **Arquivo:** `src/components/profile/QuickActionsGrid.tsx`
- **Props:** `actions[]`
- **Uso:** Grid de ações rápidas

### ProfileMenuGroup
- **Arquivo:** `src/components/profile/ProfileMenuGroup.tsx`
- **Props:** `items[]`
- **Uso:** Grupo de opções do menu

### WeightLogger
- **Arquivo:** `src/components/profile/WeightLogger.tsx`
- **Props:** `userId`
- **Persistência:** Salva em `weight_logs` no Supabase

### ConsistencyHeatmap
- **Arquivo:** `src/components/profile/ConsistencyHeatmap.tsx`
- **Props:** `userId`
- **Persistência:** Carrega dados de `user_workouts`

---

## 4. COMPONENTES DE SOCIAL/FEED

### PostCard
- **Arquivo:** `src/components/feed/PostCard.tsx` (ou similar)
- **Props:** `post`, `currentUserId`, `onLike`, `onComment`
- **Persistência:** Likes e comments salvos via hooks

### ComposerCard
- **Arquivo:** `src/components/feed/ComposerCard.tsx`
- **Props:** `onSubmit`, `userId`
- **Persistência:** Posts salvos em `posts` no Supabase

### ReelsBar
- **Arquivo:** `src/components/feed/ReelsBar.tsx`
- **Props:** `reels[]`
- **Uso:** Barra de reels na home

### DuelsSection
- **Arquivo:** `src/components/feed/DuelsSection.tsx`
- **Props:** `duels[]`
- **Uso:** Seção de duelos

---

## 5. COMPONENTES DE GAMIFICAÇÃO

### LevelCard
- **Arquivo:** `src/components/gamification/LevelCard.tsx`
- **Props:** `level`, `xp`, `progress`
- **Uso:** Card de nível

### AchievementGrid
- **Arquivo:** `src/components/gamification/AchievementGrid.tsx`
- **Props:** `achievements[]`, `unlocked[]`
- **Uso:** Grid de conquistas

### XpBreakdown
- **Arquivo:** `src/components/gamification/XpBreakdown.tsx`
- **Props:** `breakdown[]`
- **Uso:** Detalhamento de XP

### WeeklyChallenges
- **Arquivo:** `src/components/gamification/WeeklyChallenges.tsx`
- **Props:** `challenges[]`
- **Uso:** Desafios semanais

---

## 6. COMPONENTES DE ANALYTICS

### MonthlyReport
- **Arquivo:** `src/components/analytics/MonthlyReport.tsx`
- **Props:** `data`
- **Persistência:** Usa dados mock de `analyticsMock.ts`

### BenchmarkComparison
- **Arquivo:** `src/components/analytics/BenchmarkComparison.tsx`
- **Props:** `data`
- **Persistência:** Usa dados mock

### MuscleRadarChart
- **Arquivo:** `src/components/analytics/MuscleRadarChart.tsx`
- **Props:** `userId`
- **Persistência:** Carrega dados reais

### ChartsSection
- **Arquivo:** `src/components/analytics/ChartsSection.tsx`
- **Props:** `data`
- **Uso:** Seção de gráficos

---

## 7. COMPONENTES DE COMUM

### ErrorBoundary
- **Arquivo:** `src/components/common/ErrorBoundary.tsx`
- **Props:** `children`, `screenName`
- **Uso:** Captura erros de renderização

### CacheProvider
- **Arquivo:** `src/components/common/CacheProvider.tsx`
- **Props:** `children`
- **Persistência:** Cache em AsyncStorage com TTL

### NotificationManager
- **Arquivo:** `src/components/common/NotificationManager.tsx`
- **Props:** `children`
- **Persistência:** Lembretes via expo-notifications

### OfflineIndicator
- **Arquivo:** `src/components/common/OfflineIndicator.tsx`
- **Props:** Nenhum
- **Uso:** Mostra status offline/online

### TutorialOverlay
- **Arquivo:** `src/components/common/TutorialOverlay.tsx`
- **Props:** `visible`, `steps[]`, `onComplete`, `onSkip`
- **Persistência:** Estado em `tutorial.ts` service

### StreakCalculator
- **Arquivo:** `src/components/common/StreakCalculator.tsx`
- **Props:** `workouts[]`
- **Uso:** Calcula streak

---

## 8. COMPONENTES DE AUTH

### AuthInput
- **Arquivo:** `src/components/auth/AuthInput.tsx`
- **Props:** `label`, `value`, `onChangeText`, `secureTextEntry`, `error`
- **Uso:** Campos de login/cadastro

### SocialButton
- **Arquivo:** `src/components/auth/SocialButton.tsx`
- **Props:** `icon`, `label`, `onPress`, `bgColor`
- **Uso:** Botões Google/Apple

### AccountExistsCard
- **Arquivo:** `src/components/auth/AccountExistsCard.tsx`
- **Props:** `type`, `email`, `onClear`, `onGoogleSignIn`, `onAppleSignIn`
- **Uso:** Quando email já está cadastrado

### LoginLogo
- **Arquivo:** `src/components/auth/LoginLogo.tsx`
- **Props:** Nenhum
- **Uso:** Logo na tela de login

---

## 9. HOOKS

### useWorkoutTimer
- **Arquivo:** `src/hooks/useWorkoutTimer.ts`
- **Gerencia:** Estado do timer de treino (phase, exercise, set, elapsed)
- **Persistência:** Auto-save AsyncStorage a cada 10s + restore ao abrir
- **Sync:** Não sincroniza (apenas local)

### useWorkoutPlayer
- **Arquivo:** `src/hooks/useWorkoutPlayer.tsx`
- **Gerencia:** Lógica completa do player de treino
- **Persistência:** Salva treino completo via `workoutSaver.ts`
- **Proteção:** Flag `completionRef` impede duplicação

### useHomeData
- **Arquivo:** `src/hooks/useHomeData.ts`
- **Gerencia:** Dados da home (perfil, treino do dia, recentes, categorias)
- **Persistência:** Carrega do Supabase, check-in via AsyncStorage

### useFeedData
- **Arquivo:** `src/hooks/useFeedData.tsx`
- **Gerencia:** Posts do feed, likes, comentários, paginação
- **Persistência:** Supabase + Realtime

### useGamification
- **Arquivo:** `src/hooks/useGamification.tsx`
- **Gerencia:** XP, nível, conquistas, streak
- **Persistência:** Supabase

### useGoals
- **Arquivo:** `src/hooks/useGoals.tsx`
- **Gerencia:** Metas de curto prazo
- **Persistência:** Supabase (short_term_goals)

### useVacationMode
- **Arquivo:** `src/hooks/useVacationMode.ts`
- **Gerencia:** Modo férias
- **Persistência:** AsyncStorage + Supabase

### useRateLimit
- **Arquivo:** `src/hooks/useRateLimit.ts`
- **Gerencia:** Rate limiting client-side
- **Persistência:** AsyncStorage (sobrevive a restart)

---

## 10. SERVICES

### gamification.ts
- **Funções:** `addXP`, `recordWorkoutCompletion`, `awardXP`, `getRankings`, `getUserRank`
- **Tabelas:** `profiles`, `user_workouts`, `user_achievements`
- **Status:** ✅ Implementado

### workoutSaver.ts
- **Funções:** `saveCompleteWorkout`, `savePartialWorkout`
- **Tabelas:** `user_workouts`, `profiles`
- **Status:** ✅ Implementado

### checkIn.tsx
- **Funções:** `getTodayCheckIn`, `performCheckIn`, `getCheckInStreak`
- **Tabelas:** `daily_check_ins`, `profiles`
- **Status:** ✅ Implementado com try/catch

### offlineSync.ts
- **Funções:** Cache + fila + sync unificados
- **Status:** ✅ Módulo unificado

### notificationScheduler.ts
- **Funções:** Agendamento unificado de notificações
- **Status:** ✅ Módulo unificado

---

## 11. CONTEXTS

### AuthContext
- **Arquivo:** `src/context/AuthContext.tsx`
- **Prove:** `user`, `profile`, `signIn`, `signOut`, `refreshProfile`
- **Persistência:** Supabase Auth

### ThemeContext
- **Arquivo:** `src/context/ThemeContext.tsx`
- **Prove:** `colors`, `isDark`, `themeMode`, `setThemeMode`, `toggleTheme`
- **Persistência:** AsyncStorage + Supabase

### CacheProvider
- **Arquivo:** `src/components/common/CacheProvider.tsx`
- **Prove:** `getCached`, `setCached`, `clearCache`
- **Persistência:** AsyncStorage com TTL

---

## 12. PADRÕES DE DESIGN

### Cores
```javascript
COLORS.background = '#0A0E14'    // Fundo principal
COLORS.surface = '#121820'       // Cards e superfícies
COLORS.primary = '#B8FF00'       // Neon lime (botões, destaques)
COLORS.textTitle = '#FFFFFF'     // Títulos
COLORS.textMuted = '#8B8B8E'     // Texto secundário
COLORS.border = '#1E2430'        // Bordas
COLORS.success = '#00C853'       // Sucesso
COLORS.warning = '#FFB300'       // Aviso
COLORS.error = '#FF5252'         // Erro
```

### Espaçamento
```javascript
SPACING.xs = 4
SPACING.sm = 8
SPACING.md = 12
SPACING.lg = 16
SPACING.xl = 24
SPACING.xxl = 32
SPACING.xxxl = 48
```

### Bordas
```javascript
BORDER_RADIUS.sm = 6
BORDER_RADIUS.md = 8
BORDER_RADIUS.lg = 12
BORDER_RADIUS.xl = 16
BORDER_RADIUS.full = 9999
```

### Fontes
```javascript
// Títulos
fontFamily: 'Montserrat_700Bold'
fontFamily: 'Montserrat_800ExtraBold'

// Corpo
fontFamily: 'Inter_400Regular'
fontFamily: 'Inter_500Medium'
fontFamily: 'Inter_600SemiBold'
```

---

## 13. CHECKLIST POR COMPONENTE

Ao criar ou modificar um componente:

```
☐ Arquivo < 200 linhas
☐ Props tipadas com interface
☐ Usa design system (COLORS, SPACING, BORDER_RADIUS)
☐ Fontes corretas (Montserrat para títulos, Inter para corpo)
☐ Estilos em StyleSheet (nunca inline)
☐ Dados mock em src/data/ (nunca inline)
☐ Imports centralizados (de ../components)
☐ Tratamento de erro adequado
☐ Loading states quando necessário
☐ Exportado no barrel file (index.ts)
☐ Documentado neste arquivo
```

---

*Documento gerado automaticamente pelo MiMoCode Agent*
