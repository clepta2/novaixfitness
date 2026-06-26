# NOVAIX FITNESS - Regras de Desenvolvimento

## Regras Gerais (OBRIGATÓRIAS)

```
1. CADA ARQUIVO MÁXIMO 200 LINHAS
2. SEPARAR: dados, estilos, componentes, lógica
3. COMPONENTES REUTILIZÁVEIS em src/components/
4. DADOS MOCK em src/data/
5. ESTILOS INLINE SÓ quando único na tela
6. USAR DESIGN SYSTEM (COLORS, SPACING, BORDER_RADIUS, SHADOWS)
7. FONTES: Montserrat (títulos), Inter (corpo)
8. CORES: #12161A (bg), #1E232A (surface), #CCFF00 (primary)
```

## Estrutura de Pastas

```
app/                          ← TELAS (máx 200 linhas cada)
  _layout.js                  ← Root layout + auth redirect
  index.js                    ← Login
  register.js                 ← Cadastro
  forgot-password.js          ← Recuperação
  paywall.js                  ← Planos
  player.js                   ← Treinos diários
  workout-detail.js           ← Detalhe do treino
  landing.js                  ← Landing page
  admin.js                    ← Painel admin
  onboarding/                 ← Fluxo onboarding
  (tabs)/                     ← Tabs principais
    _layout.js                ← Tab bar config
    home.js                   ← Home
    feed.js                   ← Comunidade
    perfil/                   ← Perfil
    ajuda.js                  ← Ajuda/FAQ
    library.js                ← Biblioteca

src/                          ← CÓDIGO COMPARTILHADO
  components/
    index.js                  ← Exportações centralizadas
    ui/                       ← Componentes genéricos
      Button.js
      Input.js
      Card.js
      Badge.js
      ProgressBar.js
      Timer.js
      Header.js
      Avatar.js
    workout/                  ← Componentes de treino
      ExerciseAccordion.js
      ExerciseStepCarousel.js
      WorkoutCard.js          ← Card de treino reutilizável
      CategoryCard.js         ← Card de categoria
  data/                       ← DADOS MOCK
    workouts.js
    exercises.js
    categories.js
  constants/                  ← CONSTANTES
    colors.js
    spacing.js
    shadows.js
    fonts.js
  context/                    ← CONTEXTOS
    AuthContext.js
  hooks/                      ← HOOKS
    useNavigation.js
  helpers/                    ← UTILITÁRIOS
    navigation.js
  config/                     ← CONFIGURAÇÕES
    supabase.js
```

## Regras por Tela

### Login (app/index.js)
- Logo Nix + "NOVAIX FITNESS" + tagline
- Campo E-mail/CPF + Senha
- Botão ENTRAR (primary)
- Botões Google/Apple (surface + border)
- Link "Esqueceu a senha?" (underlined)
- Link "Cadastre-se" (primary bold)
- MÁX 150 linhas

### Cadastro (app/register.js)
- Campos: Nome, E-mail, Senha, Confirmar Senha
- Validação: nome obrigatório, email válido, senha 6+ chars, senhas coincidem
- Botão "CADASTRAR E CONTINUAR"
- Termos de uso + privacidade
- Link "Já tem conta? Entrar"
- MÁX 150 linhas

### Home (app/(tabs)/home.js)
- Saudação dinâmica + nome
- Card treino do dia (vídeo YouTube + timer + controles)
- Categorias (3 cards verdes)
- Stats (Streak, Treinos, Tempo)
- MÁX 200 linhas
- Extrair: WorkoutCard, CategoryCard

### Player (app/player.js)
- Header "Daily Workouts" + data
- Progress bar segmentada
- Lista de treinos (concluídos/próximos/ativo)
- Timer quando ativo
- MÁX 200 linhas
- Extrair: WorkoutListItem, ProgressSection

### Detalhe Treino (app/workout-detail.js)
- Header + favorito + mais opções
- Vídeo prévia
- Info + stats + equipamentos
- Accordion por exercício
- Botão INICIAR
- MÁX 200 linhas
- Extrair: ExerciseAccordion, StepCarousel

### Biblioteca (app/(tabs)/library.js)
- Header + busca
- Favoritos (lista horizontal)
- Categorias (grid 2x2)
- Populares + Recentes
- Stats
- MÁX 200 linhas
- Extrair: CategoryCard, WorkoutListItem

### Paywall (app/paywall.js)
- Badge "7 DIAS GRÁTIS"
- 3 cards de plano (Básico/Intermediário/Premium)
- Features com checkmarks
- Botão "LIBERAR MEU CRONOGRAMA"
- Link "Pular"
- MÁX 200 linhas

### Ajuda (app/(tabs)/ajuda.js)
- FAQ accordion
- Botão WhatsApp
- Botão E-mail
- MÁX 150 linhas

## Componentes Reutilizáveis

### WorkoutCard
```javascript
// Props: name, duration, level, category, onPress, onFavorite, isFavorite
// Uso: Home, Library, Feed
```

### CategoryCard
```javascript
// Props: label, icon, count, color, onPress, isActive
// Uso: Home, Library
```

### ExerciseAccordion
```javascript
// Props: exercise, isOpen, onToggle
// Uso: workout-detail.js
```

### StepCarousel
```javascript
// Props: steps[]
// Uso: workout-detail.js
```

## Dados Mock

### Dados em src/data/
- workouts.js → Treinos com exercícios
- exercises.js → Lista de exercícios
- categories.js → Categorias
- onboarding.js → Opções do onboarding

### Regra: Dados NUNCA inline no componente
- Se tem mais de 3 itens → mover pra src/data/
- Se é constante → mover pra src/constants/

## Imports

### Sempre usar exportações centralizadas
```javascript
// CORRETO
import { Button, Input, Card } from '../src/components';

// ERRADO
import Button from '../src/components/ui/Button';
```

### Ordem de imports
1. React/React Native
2. Expo Router
3. Bibliotecas externas
4. Componentes internos
5. Constants/Data
6. Context/Hooks

## Análise de Tamanho

### Antes de criar componente, verificar:
1. Arquivo > 200 linhas? → Dividir
2. Lógica > 50 linhas? → Extrair hook
3. JSX > 100 linhas? → Extrair sub-componente
4. Dados > 10 linhas? → Mover pra src/data/
5. Estilos > 50 linhas? → Mover pra src/styles/

## Checklist por Tela

```
☐ Arquivo < 200 linhas
☐ Dados em src/data/
☐ Componentes em src/components/
☐ Usa design system (COLORS, SPACING)
- Usa fontes corretas (Montserrat/Inter)
☐ Imports centralizados
☐ Sem dados inline
☐ Estilos organizados
☐ Funcionalidade testável
```
