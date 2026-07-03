# Design System Novaix Fitness 2026

## Visão Geral
Sistema de design moderno seguindo tendências 2025-2026.

## Paleta de Cores

### Dark Theme (Padrão)
```javascript
{
  background: '#0A0E14',      // Deep space
  surface: '#121820',         // Card surface
  surfaceElevated: '#1A2230', // Elevated elements
  primary: '#B8FF00',         // Neon lime
  secondary: '#FF6B6B',       // Coral
  success: '#00E676',
  attention: '#FFD600',
  error: '#FF5252',
  info: '#00BFFF',
  textTitle: '#FFFFFF',
  textDescription: '#A0AEC0',
  textMuted: '#5A6677',
}
```

### Gradientes Premium
```javascript
{
  gradientPrimary: ['#B8FF00', '#00E676'],
  gradientHero: ['#B8FF00', '#00BFFF'],
  gradientSurface: ['#1A2230', '#121820'],
}
```

## Tipografia

### Fontes
- **Display**: Inter_700Bold (48px)
- **Heading**: Inter_600SemiBold (24px)
- **Body**: Inter_400Regular (16px)
- **Caption**: Inter_500Medium (12px)

### Hierarquia
- H1: 32px, Bold
- H2: 24px, SemiBold
- H3: 20px, SemiBold
- Body: 16px, Regular
- Caption: 12px, Medium

## Espaçamento

### Base Unit: 4px
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Border Radius
```
sm: 8px
md: 12px
lg: 16px
xl: 24px
full: 9999px
```

## Sombras

### Elevações
```javascript
{
  glass: { shadowRadius: 32, elevation: 24 },
  floating: { shadowRadius: 24, elevation: 16 },
  subtle: { shadowRadius: 12, elevation: 8 },
}
```

## Animações

### Spring Physics
```javascript
{
  friction: 5,
  tension: 40,
  useNativeDriver: true,
}
```

### Durações
- Micro: 100-200ms
- Normal: 300-400ms
- Slow: 500-600ms

## Componentes

### GlassCard
- Efeito blur com opacity 0.8
- Bordas sutis rgba(255,255,255,0.1)
- Variants: elevated, flat, outlined

### HapticButton
- Feedback háptico: light, medium, heavy
- Scale animation: 0.96 no press
- Variants: primary, secondary, ghost, danger

### FloatingCard
- Shadow dinâmica baseada em elevation
- Glow effect com cor customizável
- Scale animation no press

### AnimatedGradient
- Translação em X e Y
- Velocidade configurável
- Cores customizáveis

## Acessibilidade

### Touch Targets
- Mínimo: 44x44px
- Recomendado: 48x48px

### Contraste
- WCAG AA: 4.5:1 (texto normal)
- WCAG AAA: 7:1 (texto grande)
