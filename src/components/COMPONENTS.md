# NOVAIX FITNESS - Guia de Componentes

## Visao Geral

Este documento lista todos os componentes reutilizaveis disponiveis no projeto, organizados por categoria.

---

## Estados de UI

### ScreenLoader
Loading state padronizado para telas inteiras.

```tsx
import { ScreenLoader } from '../src/components';

// Uso basico
if (loading) return <ScreenLoader />;

// Com mensagem
if (loading) return <ScreenLoader message="Carregando treinos..." />;

// Inline (tamanho pequeno)
<ScreenLoader message="Salvando..." size="small" />
```

### ErrorDisplay
Error state padronizado com retry.

```tsx
import { ErrorDisplay } from '../src/components';

// Com retry
if (error) return <ErrorDisplay message={error} onRetry={loadData} />;

// Sem retry
<ErrorDisplay message="Algo deu errado" />

// Com icone customizado
<ErrorDisplay icon="wifi-outline" message="Sem conexao" onRetry={loadData} />
```

### EmptyDisplay
Empty state padronizado com CTA opcional.

```tsx
import { EmptyDisplay } from '../src/components';

// Basico
<EmptyDisplay icon="barbell-outline" title="Nenhum treino" />

// Com descricao
<EmptyDisplay
  icon="camera-outline"
  title="Nenhuma foto"
  message="Adicione fotos de progresso"
/>

// Com CTA
<EmptyDisplay
  icon="bag-outline"
  title="Nenhum produto"
  message="Explore o marketplace"
  ctaText="VER PRODUTOS"
  onCta={() => router.push('/marketplace')}
/>
```

---

## Acessibilidade

### AccessibleButton
Botao com suporte completo a acessibilidade.

```tsx
import { AccessibleButton } from '../src/components';

// Basico
<AccessibleButton label="SALVAR" onPress={handleSave} />

// Com variante
<AccessibleButton label="CANCELAR" onPress={handleCancel} variant="secondary" />

// Com icone
<AccessibleButton
  label="EXCLUIR"
  onPress={handleDelete}
  variant="secondary"
  icon="trash-outline"
  iconColor={COLORS.error}
/>

// Com loading
<AccessibleButton label="ENVIANDO" onPress={handleSend} loading={true} />

// Tamanhos
<AccessibleButton label="SMALL" onPress={handlePress} size="sm" />
<AccessibleButton label="LARGE" onPress={handlePress} size="lg" />
```

Variantes: `primary` | `secondary` | `ghost`
Tamanhos: `sm` | `md` | `lg`

---

## Performance

### OptimizedList
FlatList com otimizacoes padrao.

```tsx
import { OptimizedList } from '../src/components';

<OptimizedList
  data={workouts}
  renderItem={({ item }) => <WorkoutCard workout={item} />}
  keyExtractor={(item) => item.id}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
```

### SectionHeader
Titulo de secao padronizado.

```tsx
import { SectionHeader } from '../src/components';

// Basico
<SectionHeader title="MEUS TREINOS" />

// Com subtitulo
<SectionHeader title="CONQUISTAS" subtitle="12 desbloqueados" />

// Com acao
<SectionHeader
  title="HISTORICO"
  action="Ver tudo"
  onAction={() => router.push('/history')}
/>
```

Tamanhos: `sm` | `md` | `lg`

---

## Hooks de Acesso

### useHaptic
Haptic feedback padronizado.

```tsx
import { useHaptic } from '../src/hooks/useHaptic';

const { trigger } = useHaptic();

// Tipos disponiveis:
trigger('light');    // Selecao simples
trigger('medium');   // Acao confirmada
trigger('heavy');    // Acao importante
trigger('success');  // Operacao bem sucedida
trigger('warning');  // Aviso
trigger('error');    // Erro
```

### useRateLimit
Rate limiting client-side.

```tsx
import { useRateLimit } from '../src/hooks/useRateLimit';

const { isBlocked, canExecute, recordAttempt, cooldownSeconds } = useRateLimit({
  maxAttempts: 5,
  windowMs: 60000, // 1 minuto
});

const handleLogin = async () => {
  if (!canExecute()) {
    Alert.alert('Muitas tentativas', `Aguarde ${cooldownSeconds}s`);
    return;
  }
  recordAttempt();
  await login(email, password);
};
```

---

## Utilitarios

### sanitize.ts
Input sanitization.

```tsx
import { sanitizeHtml, sanitizeInput, sanitizeEmail, sanitizePassword, formatCurrency } from '../src/helpers/sanitize';

// Limpar HTML
sanitizeHtml('<script>alert("xss")</script>') // ""

// Limpar inputs
sanitizeInput("user'; DROP TABLE users;--")

// Validar email
const { valid, value, error } = sanitizeEmail('user@email.com');

// Validar senha
const { valid, strength, errors } = sanitizePassword('MyP@ss123');

// Formatar moeda
formatCurrency(129.90) // "R$ 129,90"
```

---

## Animacoes

### useEntryAnimation
Animacao de entrada padronizada.

```tsx
import { useEntryAnimation } from '../src/hooks/useEntryAnimation';

const { fade, slide } = useEntryAnimation();

<Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
  <Content />
</Animated.View>

// Com opcoes
const { fade, slide } = useEntryAnimation({
  duration: 800,
  slideDistance: 30,
  delay: 200,
});
```

---

## Headers

### ScreenHeader
Header padronizado com back button.

```tsx
import { ScreenHeader } from '../src/components';

// Basico
<ScreenHeader title="MINHA TELA" onBack={() => router.back()} />

// Com acao a direita
<ScreenHeader
  title="CONFIGURACOES"
  onBack={() => router.back()}
  rightIcon="settings-outline"
  onRightPress={() => openSettings()}
/>
```

---

## Badges & Pills

### Badge
Badge de status.

```tsx
import { Badge } from '../src/components';

<Badge text="NOVO" variant="primary" />
<Badge text="3" variant="error" />
```

### Chip
Chip de selecao.

```tsx
import { Chip } from '../src/components';

<Chip label="MUSCULACAO" isSelected={selected} onPress={toggle} />
```

---

## Cards

### Card
Card generico.

```tsx
import { Card } from '../src/components';

<Card onPress={handlePress}>
  <Text>Conteudo</Text>
</Card>
```

### StatsCard
Card de estatistica.

```tsx
import { StatsCard } from '../src/components';

<StatsCard icon="flame" value={1250} label="XP Total" color={COLORS.primary} />
```

---

## Modais

### Modal
Modal padronizado.

```tsx
import { Modal } from '../src/components';

<Modal visible={showModal} onClose={() => setShowModal(false)}>
  <Text>Conteudo do modal</Text>
</Modal>
```

### ConfirmModal
Modal de confirmacao.

```tsx
import { ConfirmModal } from '../src/components';

<ConfirmModal
  visible={showConfirm}
  title="Excluir treino?"
  message="Esta acao nao pode ser desfeita."
  confirmText="EXCLUIR"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
  variant="danger"
/>
```

---

## Formularios

### Input
Input padronizado.

```tsx
import { Input } from '../src/components';

<Input
  label="E-MAIL"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  icon="mail-outline"
/>
```

### FormValidation
Mensagem de validacao.

```tsx
import { FormValidation } from '../src/components';

<FormValidation isValid={isEmailValid} message="E-mail invalido" />
```

---

## Listas

### ListItem
Item de lista padronizado.

```tsx
import { ListItem } from '../src/components';

<ListItem
  icon="person-outline"
  title="Meu Perfil"
  subtitle="Editar informacoes"
  onPress={() => router.push('/profile')}
/>
```

### ListSection
Secao de lista com titulo.

```tsx
import { ListSection } from '../src/components';

<ListSection title="CONFIGURACOES">
  <ListItem icon="moon" title="Tema" onPress={openTheme} />
  <ListItem icon="language" title="Idioma" onPress={openLanguage} />
</ListSection>
```

---

## Feedback

### Toast
Toast de notificacao.

```tsx
import { useToast } from '../src/components';

const { show } = useToast();

show('Treino salvo com sucesso!', 'success');
show('Erro ao salvar', 'error');
show('Atencao', 'warning');
```

### Loading
Loading inline.

```tsx
import { Loading } from '../src/components';

<Loading variant="pulse" />
<Loading variant="dots" />
```

---

## Layout

### BottomTabBar
Barra de navegacao inferior.

```tsx
import { BottomTabBar } from '../src/components';

<BottomTabBar activeTab="home" />
```

### BottomSheet
Bottom sheet.

```tsx
import { BottomSheet } from '../src/components';

<BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
  <Text>Conteudo</Text>
</BottomSheet>
```

---

## Constantes de Espacamento

```tsx
import { SPACING, BORDER_RADIUS, SHADOWS } from '../src/constants/spacing';

// Espacamento
SPACING.xs   // 4
SPACING.sm   // 8
SPACING.md   // 12
SPACING.lg   // 16
SPACING.xl   // 24
SPACING.xxl  // 32
SPACING.xxxl // 48

// Border radius
BORDER_RADIUS.sm   // 4
BORDER_RADIUS.md   // 8
BORDER_RADIUS.lg   // 12
BORDER_RADIUS.xl   // 16
BORDER_RADIUS.full // 999

// Shadows
SHADOWS.sm
SHADOWS.md
SHADOWS.lg
```
