# Analise Completa dos Hooks - src/hooks/
# Data: 2026-07-03

## Resumo Executivo
- Total: 44 hooks em 44 arquivos + 5 helpers + 1 index
- Hooks com persistencia Supabase: 28
- Hooks com persistencia AsyncStorage: 3
- Hooks puramente de UI/state local: 13
- Hooks de infraestrutura (realtime, debounce, etc): 8
- Hooks com problema de useEffect: 7
- Hooks com gaps de persistencia: 15
- Hooks que violam regra de 200 linhas: 1 (useFeedData.tsx = 203)

---

## GRUPO A - HOOKS DE AUTENTICACAO

### 1. useLogin.tsx (120 linhas)
- State: email, password, loading, error
- Persiste: N/A (delega ao AuthContext)
- Sincroniza: SIM - busca CPF em profiles para resolver email
- Duplicacao: NENHUMA
- useEffect: CORRETO - [paramEmail] para deep link
- GAPS: Nao salva ultimo email em AsyncStorage; biometria navega sem validar sessao; nao limpa erro ao digitar

### 2. useRegister.tsx (168 linhas)
- State: 13 campos (name, email, phone, cpf, password, confirm, loading, modal, strength, etc)
- Persiste: RPCs does_email_exist/does_cpf_exist + signUpWithEmail
- Sincroniza: SIM - debounce 150ms para validacao de duplicatas
- Duplicacao: SIM - emailTaken/cpfTaken bloqueiam submit
- useEffect: CORRETOS - 4 useEffects com cleanup de setTimeout
- GAPS: Nao salva progresso do cadastro; phone nao checado contra duplicidade no banco

### 3. useSecurity.tsx (173 linhas)
- State: blocked (BlockInfo)
- Persiste: SIM - canPerformAction, logAction, moderateText/Image/Username
- Sincroniza: SIM - servicos de seguranca e moderacao
- Duplicacao: N/A
- useEffect: NENHUM (tudo via useCallback)
- GAPS: getCensoredText usa require() dinamico; checkText mostra alert mas nao bloqueia fluxo programaticamente

---

## GRUPO B - HOOKS DE TREINO

### 4. useWorkoutPlayer.tsx (161 linhas)
- State: workout, loading, showRating, showCompletion, voiceEnabled, showXP, xpAmount
- Persiste: saveCompleteWorkout, queueWorkoutCompletion (offline), upsert rating
- Sincroniza: SIM - busca workout + salva resultado + awardXP
- Duplicacao: NENHUMA - pode completar mesmo treino N vezes
- useEffect: BOM - KeepAwake ativado/desativado corretamente
- GAPS: Nao salva progresso intermediario (crash perde tudo); timer como dependencia causa re-renders

### 5. useWorkoutDetail.tsx (160 linhas)
- State: workout, profile, loading, expanded, showVideo, isFavorite, showOptions, showRating, isOffline
- Persiste: cacheWorkoutDetail, favorites, rating via upsert
- Sincroniza: SIM - busca workout + profile + favorites
- Duplicacao: NENHUMA
- useEffect: BEM FEITO - [id] e [user?.id, id]
- GAPS: Nao invalida cache offline ao reconectar; handleStart pode criar user_workouts duplicados

### 6. useWorkoutTimer.ts (195 linhas)
- State: phase, currentExerciseIndex, currentSet, timeRemaining, totalTime, elapsed, logs
- Persiste: NENHUM - timer e puramente in-memory
- Sincroniza: NAO
- Duplicacao: N/A
- useEffect: USA refs para evitar stale closure (boa pratica)
- GAPS: Interval continua se componente desmontar sem stopWorkout (memory leak); Nao persiste estado do timer; elapsed inclui tempo de descanso

### 7. useWorkoutHistory.ts (99 linhas)
- State: workouts, selectedPeriod, loading, stats
- Persiste: READ-ONLY - busca user_workouts
- Sincroniza: SIM - query com filtro temporal
- Duplicacao: N/A
- GAPS: Sem paginacao; avgRating retorna number quando vazio mas tipo diz number|string

### 8. usePlayerList.tsx (142 linhas)
- State: workouts, active, loading, refreshing, profile
- Persiste: SIM - profiles, user_workouts, workouts + planGenerator + planAdaptation
- Sincroniza: SIM - busca plano e adapta com IA
- Duplicacao: NENHUMA
- GAPS: adaptIfNeeded pode ser chamado multiplas vezes; ordenacao por nivel e client-side

### 9. useWorkoutForm.ts (120 linhas)
- State: name, description, category, level, duration, isPremium, exercises, showExerciseForm, editingExercise
- Persiste: NENHUM - form state puro
- Sincroniza: NAO
- GAPS: Nao salva rascunho do formulario (AsyncStorage)

### 10. useCreateWorkout.ts (134 linhas)
- State: step, saving, form, exercises, configIndex, errors
- Persiste: SIM - insere em user_workouts (como treino custom)
- Sincroniza: SIM - apos salvar
- GAPS: Nao valida nome duplicado entre treinos do usuario

### 11. useGuidedAssessment.tsx (110 linhas)
- State: phase, currentTest, results, isRunning, elapsed, inputValue, prevResults
- Persiste: SIM - insere em fitness_assessments
- Sincroniza: SIM - busca resultado anterior + salva novo
- useEffect: CORRETO - timer com cleanup, loadPrevious com [user?.id]
- GAPS: Nao permite refazer assessment; results nao persistem parcialmente (se crashar, perde tudo)

---

## GRUPO C - HOOKS DE FEED/COMUNIDADE

### 12. useFeedData.tsx (203 linhas) - VIOLA LIMITE DE 200
- State: posts, likedPostIds, selectedFilter, showCreatePost, refreshing, loading, loadingMore, hasMore, page, hasNotif, showNotifications
- Persiste: SIM - posts, likes, comments no Supabase
- Sincroniza: Realtime via useRealtimePosts
- Duplicacao: SIM - likedPostIds evita likes duplos
- GAPS: Arquivo excede 200 linhas; likedPostIds carregado separadamente causa estado inicial incorreto; optimistic update nao e robusto

### 13. useFeedStories.ts (53 linhas)
- State: stories, showCheckIn, checkInStreak
- Persiste: SIM - getTodayCheckIn, performCheckIn
- Sincroniza: SIM - stories ativos + check-in
- Duplicacao: SIM - global.hasShownCheckInThisSession
- GAPS: Mesma flag global do useHomeData (conflito); seen nos stories sempre false

### 14. useSocialFeed.ts (107 linhas)
- State: posts, refreshing, unreadCount, stories, recentCheckIns
- Persiste: SIM - Supabase via useSupabaseData + realtime
- Sincroniza: SIM - realtime posts + notificacoes + stories
- Duplicacao: processingLikes ref
- GAPS: DUPLICA funcao de useFeedData (posts+likes+comments); isLiked sempre false nos posts mapeados; useSupabaseData faz ping de conexao toda busca

### 15. useReelsFeed.ts (60 linhas)
- State: reels, loading
- Persiste: READ-ONLY
- Sincroniza: SIM - busca posts tipo video
- GAPS: Sem paginacao; isLiked nao rastreado

### 16. useTrendingContent.ts (143 linhas)
- State: trendingPosts, hashtags, suggestedUsers, loading, refreshing
- Persiste: SIM - busca posts, profiles, follows
- Sincroniza: SIM - queries ao Supabase
- GAPS: fetchTrendingPosts usa post_likes e post_comments como subqueries O(N) no client

### 17. useRealNotifications.ts (105 linhas)
- State: notifications, unreadCount, loading
- Persiste: SIM - via servicos de notificacao
- Sincroniza: SIM - Realtime com canal dedicado
- Duplicacao: N/A
- GAPS: Callback onInsert via ref nao e tipado corretamente; notifications podem ficar stale entre refreshes

### 18. useNotificationPrefs.ts (120 linhas)
- State: notifications, loading, refreshing, prefs, reminderTime, pushEnabled, quietHours
- Persiste: SIM - Supabase profiles.notification_settings + tabela notification_preferences
- Sincroniza: SIM
- GAPS: reminderTime e pushEnabled podem ficar dessincronizados do Supabase se update falhar; quietHours nao e salvo no Supabase

---

## GRUPO D - HOOKS DE DADOS/DASHBOARD

### 19. useDashboard.tsx (153 linhas)
- State: data (DashboardData), refreshing
- Persiste: READ-ONLY - 8 queries Paralelas
- Sincroniza: SIM - profiles, user_workouts, analytics
- GAPS: Sem cache local (8 queries toda tela); nao limpa dados no logout; calculatingLevel(0) hardcoded

### 20. useHomeData.ts (135 linhas)
- State: profile, dailyWorkout, dailyOffline, recentWorkouts, categoryCounts, levelData, initialLoading, refreshing, timeOfDay, showCheckIn, checkInStreak
- Persiste: SIM - profiles, workouts, user_workouts, checkIn
- Sincroniza: SIM
- Duplicacao: global.hasShownCheckInThisSession
- GAPS: Flag global e in-memory (reiniciar app reseta); calculateLevel(0) hardcoded com XP=0; efeito cascata profile->fetchData pode causar timing issues

### 21. useWeeklyProgress.tsx (146 linhas)
- State: weekData
- Persiste: READ-ONLY - user_workouts + profiles
- Sincroniza: SIM
- GAPS: useEffect nao tem cleanup; dados podem ficar stale se periodo mudar rapidamente

### 22. useGoals.tsx (87 linhas)
- State: goals, unlocked, stats, showAddModal, newGoalType, newGoalTarget
- Persiste: SIM - short_term_goals, user_achievements, user_workouts, profiles
- Sincroniza: SIM
- GAPS: stats.streak sempre 0 (hardcoded); stats.totalMeals e waterStreak sempre 0

### 23. useLibraryData.ts (191 linhas)
- State: 14 campos de filtro + favorites + profile + cachedIds
- Persiste: SIM - workouts via useSupabaseData + favorites
- Sincroniza: SIM
- GAPS: Perto do limite de 200 linhas; favorites carregados toda vez; nao tem debounce na busca

### 24. useMarketplaceData.ts (93 linhas)
- State: products, featured, loading, refreshing, offset, hasMore, search, selectedCategory, favorites, recentSearches
- Persiste: SIM - Supabase + AsyncStorage (recentSearches)
- Sincroniza: SIM
- Duplicacao: N/A
- GAPS: recentSearches so salva no AsyncStorage, nao no Supabase (perde entre dispositivos)

---

## GRUPO E - HOOKS DE PERFIL/USUARIO

### 25. useProfileEdit.tsx (99 linhas)
- State: profile, stats, showEditName
- Persiste: SIM - profiles (update avatar, name)
- Sincroniza: SIM - busca profile + workouts + favorites
- GAPS: Avatar upload salva URI local no banco, nao upload para Storage; sem validacao de nome duplicado

### 26. useProgressPhotos.tsx (136 linhas)
- State: photos, selectedLabel, showPicker, loading, selectedPhoto, compareMode, comparePhotos
- Persiste: SIM - via servicos de progress-photos (Supabase Storage)
- Sincroniza: SIM
- GAPS: comparePhotos nao e persistido (se mudar de tela, perde selecao); toggleCompare tem logica confusa com estado anterior

### 27. useDadosFisicos.tsx (70 linhas)
- State: gender, dob, showCalendar, weight, height, state, city, cep, street, neighborhood, number, nearTo
- Persiste: SIM - saveOnboarding + updateProfile
- Sincroniza: SIM - le do onboarding existente
- GAPS: Nao valida CEP contra banco; campos de endereco nao sao obrigatorios mas podem estar incompletos

### 28. useSubscription.tsx - useSubscription() (linhas 65-130)
- State: plan, plans, usage, loading, payments
- Persiste: SIM - servicos de monetizacao
- Sincroniza: SIM
- GAPS: payments sempre vazio []; loading nao e resetado em erro; subscribe/cancel usam user.id sem null check

### 29. useSubscription.tsx - useCoupon() (linhas 132-163)
- State: discount, loading, error
- GAPS: Limpa desconto mas nao re-verifica validade

### 30. useSubscription.tsx - useReferral() (linhas 165-192)
- State: stats, loading
- GAPS: generateCode usa user.id sem null check

---

## GRUPO F - HOOKS DE PAGAMENTO

### 31. usePaymentProcessing.ts (166 linhas)
- State: selected, coupon, processing, processStep, paymentId
- Persiste: SIM - createCheckout + Supabase profiles
- Sincroniza: SIM - polling de status de pagamento
- GAPS: Polling continua mesmo apos desmontar; activateMockPlan so funciona em dev; sem timeout global

### 32. useProcessing.ts (121 linhas) - ONBOARDING
- State: currentStep, elapsedTime, spinValue (Animated)
- Persiste: SIM - updateProfile + generateWorkoutPlan + saveWorkoutPlan + generateMealPlan + user_meal_plans
- Sincroniza: SIM - gera plano de treino e refeicao
- useEffect: USA cancelled flag para cleanup
- GAPS: Se geracao de plano falhar, usuario fica preso na tela de processamento; retry recursion infinita possivel

---

## GRUPO G - HOOKS DE ANALYTICS

### 33. useAnalytics.ts (96 linhas)
- State: NENHUM (hook funcional puro)
- Persiste: via servicos de analyticsTracker
- GAPS: Sem state - tracking e fire-and-forget sem feedback ao usuario

### 34. useAnalyticsData.tsx (161 linhas - 5 hooks)
- useAnalyticsData(): report data + loading + error + refresh
- useWorkoutAnalytics(): workout data
- useNutritionAnalytics(): nutrition data
- useProgressAnalytics(): progress data
- useEngagementMetrics(): engagement data
- GAPS: Todos seguem mesmo padrao - potencial para 1 hook generico; erro silenciado em sub-hooks

### 35. useAnalyticsAdmin.ts (78 linhas - 3 hooks)
- useCohortAnalysis(): cohort data
- useUserRetention(): retention data
- useUserSegmentation(): segmentation data
- GAPS: Erros silenciados com catch vazio

### 36. useExportData.tsx (103 linhas)
- State: exporting (que tipo esta exportando)
- Persiste: via servicos csv-export
- GAPS: Sem progresso de exportacao; erro generico sem detalhes

---

## GRUPO H - HOOKS DE CHAT

### 37. useChatCoach.tsx (157 linhas)
- State: messages, inputText, profile, loading, historyLoaded
- Persiste: SIM - saveChatMessage, getChatHistory, clearChatHistory (Supabase)
- Sincroniza: SIM - busca historico ao iniciar
- Duplicacao: N/A
- GAPS: profile carregado internamente mas nao retornado; handleSend tem 7 dependencias (pode causar re-renders); nao ha debounce no envio

---

## GRUPO I - HOOKS DE INFRAESTRUTURA/UTILIDADE

### 38. useNetworkStatus.ts (45 linhas)
- State: isConnected, isInternetReachable, lastConnected
- Persiste: NAO
- GAPS: lastConnected no useEffect pode causar loop se mudar rapidamente

### 39. useOfflineStatus.ts (19 linhas)
- State: syncing, justReconnected
- Wrapper do useNetworkStatus
- GAPS: syncing e fake (setTimeout 3s, nao sincroniza realmente)

### 40. useDebounce.ts (25 linhas)
- Funcao utilitaria pura
- BEM IMPLEMENTADO

### 41. useRateLimit.ts (109 linhas)
- State: isBlocked, cooldownSeconds
- Persiste: NAO (in-memory com refs)
- GAPS: Rate limit e perdido ao reiniciar app; cooldownTimer pode vazar se componente desmontar

### 42. useScreenLimits.ts (79 linhas)
- State: NENHUM (usa ref)
- Wrapper do rateLimiter util
- BEM IMPLEMENTADO

### 43. useHaptic.tsx (72 linhas)
- Hook funcional puro
- BEM IMPLEMENTADO

### 44. useIntro.ts (94 linhas)
- State: currentIndex
- Persiste: AsyncStorage (intro_seen flag)
- GAPS: viewabilityConfig tem bug de sintaxe (chaves sem return); nao navega para login apos ver intro

### 45. useTutorial.ts (72 linhas)
- State: visible, steps, completed
- Persiste: SIM - hasCompletedTutorial, completeTutorial, markTutorialSkipped
- Sincroniza: SIM
- GAPS: restartTutorial nao reseta no banco (so muda state local)

### 46. useEntryAnimation.ts (28 linhas)
- Hook utilitario de animacao
- BEM IMPLEMENTADO

### 47. useResponsive.ts (38 linhas)
- Hook utilitario de dimensoes
- BEM IMPLEMENTADO

### 48. useMountedRef.ts (11 linhas)
- Hook utilitario anti-leak
- BEM IMPLEMENTADO

### 49. useVacationMode.ts (42 linhas)
- State: enabled, startDate, endDate
- Persiste: AsyncStorage
- GAPS: NAO sincroniza com Supabase (vacation mode so existe localmente); outros dispositivos nao sabem que esta em ferias

### 50. useRealtimePosts.ts (70 linhas)
- Hook de infraestrutura - Realtime subscription
- BEM IMPLEMENTADO com callbacksRef

### 51. useRealtimeComments.ts (33 linhas)
- Hook de infraestrutura - Realtime subscription
- BEM IMPLEMENTADO com callbackRef

### 52. useRealtimeLikes.ts (43 linhas)
- Hook de infraestrutura - Realtime subscription
- BEM IMPLEMENTADO com callbacksRef

### 53. useServiceCall.ts (31 linhas)
- Hook wrapper para chamadas com error handling
- BEM IMPLEMENTADO

### 54. useSupabaseData.ts (132 linhas)
- Hook generico CRUD com fallback mock
- GAPS: Faz ping de conexao a cada busca (overhead); insert/update/remove re-fetcham tudo

---

## TOP 10 GAPS CRITICOS

1. useWorkoutTimer: Nao persiste progresso - crash perde treino inteiro
2. useWorkoutPlayer: Sem protecao contra completar mesmo treino N vezes
3. useWorkoutPlayer: Sem save intermediario durante treino
4. useHomeData + useFeedStories: Flag global hasShownCheckInThisSession e in-memory e compartilhada entre hooks
5. useFeedData: Arquivo com 203 linhas - viola regra dos 200
6. useSocialFeed: Duplica logica de useFeedData inteiramente
7. useVacationMode: Persiste apenas em AsyncStorage - nao sincroniza com banco
8. useRateLimit: Contadores perdidos ao reiniciar app
9. useDashboard: 8 queries simultaneas sem cache - lento em conexoes lentas
10. useGoals: stats.streak, totalMeals e waterStreak hardcoded como 0

## HOOKS QUE NAO SAO EXPORTADOS PELO index.ts

- useChatCoach (exportado)
- useIntro (exportado)
- useHaptic (exportado)
- useSecurity (exportado)
- Todos os 53 hooks estao no index.ts
