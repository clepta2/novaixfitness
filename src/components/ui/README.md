# Componentes UI - Design System Novaix Fitness

## Visão Geral
Biblioteca de componentes reutilizáveis seguindo tendências UI/UX 2025-2026.

## Componentes Modernos

### GlassCard
Card com efeito glassmorphism/blur.

```tsx
import { GlassCard } from '../components/ui';

<GlassCard variant="elevated" blur={20} intensity={0.8}>
  {children}
</GlassCard>
```

**Props:**
- `variant`: 'elevated' | 'flat' | 'outlined'
- `blur`: number (intensidade do blur, padrão: 20)
- `intensity`: number (opacidade do blur, padrão: 0.8)

---

### HapticButton
Botão com feedback háptico e micro-interações.

```tsx
import { HapticButton } from '../components/ui';

<HapticButton
  label="INICIAR"
  icon="play"
  variant="primary"
  haptic="medium"
  size="md"
  onPress={handlePress}
/>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `haptic`: 'light' | 'medium' | 'heavy'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: string (nome do ícone Ionicons)
- `iconPosition`: 'left' | 'right'

---

### FloatingCard
Card flutuante com sombra dinâmica.

```tsx
import { FloatingCard } from '../components/ui';

<FloatingCard elevation={16} glowColor={COLORS.primary} onPress={handlePress}>
  {children}
</FloatingCard>
```

**Props:**
- `elevation`: number (altura da sombra, padrão: 16)
- `glowColor`: string (cor do glow)
- `onPress`: function (opcional)

---

### AnimatedGradient
Fundo gradiente animado.

```tsx
import { AnimatedGradient } from '../components/ui';

<AnimatedGradient
  colors={['#B8FF00', '#00E676', '#00BFFF']}
  animated={true}
  speed={0.5}
/>
```

**Props:**
- `colors`: string[] (cores do gradiente)
- `animated`: boolean (padrão: true)
- `speed`: number (velocidade da animação, padrão: 0.5)

---

### BentoGrid
Layout grid moderno estilo Apple.

```tsx
import { BentoGrid } from '../components/ui';

<BentoGrid
  items={[
    { id: '1', component: <Card />, size: 'large' },
    { id: '2', component: <Card />, size: 'small' },
    { id: '3', component: <Card />, size: 'small' },
  ]}
  columns={2}
  gap={16}
/>
```

**Props:**
- `items`: BentoItem[] (array de itens com id, component, size)
- `columns`: number (padrão: 2)
- `gap`: number (espaçamento entre itens)

---

### ScrollProgress
Barra de progresso de scroll.

```tsx
import { ScrollProgress } from '../components/ui';

<ScrollProgress progress={scrollProgress} color={COLORS.primary} height={3} />
```

**Props:**
- `progress`: Animated.AnimatedInterpolation
- `color`: string (cor da barra)
- `height`: number (altura em pixels)

---

### MagneticButton
Botão com efeito magnético.

```tsx
import { MagneticButton } from '../components/ui';

<MagneticButton
  icon="add"
  size={56}
  color={COLORS.primary}
  onPress={handlePress}
  magneticRange={30}
/>
```

**Props:**
- `icon`: string (ícone Ionicons)
- `size`: number (tamanho em pixels)
- `color`: string (cor de fundo)
- `magneticRange`: number ( alcance do efeito magnético)

---

### MorphingIcon
Ícone que transforma entre dois estados.

```tsx
import { MorphingIcon } from '../components/ui';

<MorphingIcon
  activeIcon="heart"
  inactiveIcon="heart-outline"
  isActive={isLiked}
  activeColor={COLORS.error}
  size={24}
/>
```

**Props:**
- `activeIcon`: string (ícone quando ativo)
- `inactiveIcon`: string (ícone quando inativo)
- `isActive`: boolean (estado atual)
- `size`: number
- `activeColor`: string

---

### TypewriterText
Texto com efeito typewriter.

```tsx
import { TypewriterText } from '../components/ui';

<TypewriterText
  text="Bem-vindo ao Novaix!"
  speed={50}
  delay={500}
  textStyle={styles.title}
  onComplete={() => console.log('Terminou')}
/>
```

**Props:**
- `text`: string
- `speed`: number (ms por caractere, padrão: 50)
- `delay`: number (delay inicial em ms)
- `textStyle`: TextStyle
- `onComplete`: function

---

### Spacer
Espaçador reutilizável.

```tsx
import { Spacer } from '../components/ui';

<Spacer size={16} horizontal={false} />
```

**Props:**
- `size`: number (padrão: 16)
- `horizontal`: boolean (padrão: false)

---

## Componentes de Dados

### StatsRow
Row de estatísticas.

```tsx
import { StatsRow } from '../components/ui';

<StatsRow stats={[
  { value: '1250', label: 'Calorias' },
  { value: '45', label: 'Minutos' },
]} />
```

---

### StatCard
Card de estatística individual.

```tsx
import { StatCard } from '../components/ui';

<StatCard
  icon="flame"
  value={1250}
  label="Calorias"
  trend={12}
  color={COLORS.secondary}
/>
```

---

## Componentes de Formulário

### FormField
Campo de formulário reutilizável.

```tsx
import { FormField } from '../components/ui';

<FormField
  label="NOME"
  placeholder="Digite seu nome"
  value={name}
  onChangeText={setName}
  icon="person-outline"
/>
```

---

### FilterPill
Pill selecionável para filtros.

```tsx
import { FilterPill } from '../components/ui';

<FilterPill
  label="Todos"
  isSelected={selectedFilter === 'all'}
  onPress={() => setSelectedFilter('all')}
/>
```

---

## Componentes de Feedback

### PlaceholderState
Estado vazio/placeholder.

```tsx
import { PlaceholderState } from '../components/ui';

<PlaceholderState
  icon="barbell-outline"
  title="Nenhum treino"
  message="Comece criando um treino"
/>
```

---

### PrimaryActionButton
Botão de ação principal full-width.

```tsx
import { PrimaryActionButton } from '../components/ui';

<PrimaryActionButton
  label="INICIAR TREINO"
  onPress={handleStart}
  icon="play"
  variant="primary"
/>
```

---

## Constantes de Design

### Cores (src/constants/colors.ts)
- `background`: '#0A0E14' (deep space)
- `surface`: '#121820'
- `primary`: '#B8FF00' (neon lime)
- `secondary`: '#FF6B6B' (coral)

### Espaçamento (src/constants/spacing.ts)
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

### Border Radius (src/constants/spacing.ts)
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `full`: 9999px
