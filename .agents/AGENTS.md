# NOVAIX FITNESS — Design System Rules

## Regras Obrigatórias (NUNCA violar)

### 1. Cores
- **SEMPRE** use `COLORS.xxx` de `src/constants/colors.js`
- **NUNCA** escreva hex inline: `color: '#FF6B35'` ❌ → `color: COLORS.secondary` ✅
- Para cores semânticas: `COLORS.success`, `COLORS.error`, `COLORS.attention`, `COLORS.water`, `COLORS.info`
- Para backgrounds sutis: `COLORS.successBg`, `COLORS.errorBg`, `COLORS.waterBg`
- Para gradientes: `COLORS.gradientPrimary`, `COLORS.gradientAccent`, etc.
- **NÃO EXISTE** `COLORS.textSecondary` — use `COLORS.textDescription`

### 2. Tipografia
- **FONTE ÚNICA DE VERDADE**: `src/styles/typography.js`
- **NUNCA** escreva `fontFamily:` em StyleSheets locais
- Use tokens: `typography.h1..h5`, `typography.body`, `typography.bodySmall`, `typography.bodyMuted`, `typography.caption`, `typography.label`, `typography.stat`, `typography.number`, `typography.button`
- `fonts.js` é DEPRECATED — existe apenas para retrocompatibilidade
- Todos os estilos JÁ incluem `lineHeight` — não precisa adicionar

### 3. Espaçamentos
- Use `SPACING.xxx` de `src/constants/spacing.js`: xs(4), sm(8), md(12), lg(16), xl(20), xxl(24), xxxl(32)
- Use `BORDER_RADIUS.xxx`: sm(8), md(12), lg(16), xl(20), full(9999)
- **NUNCA** `borderRadius: 12` ❌ → `borderRadius: BORDER_RADIUS.md` ✅

### 4. Ícones
- **APENAS** Ionicons (`@expo/vector-icons`)
- **NUNCA** Lucide, MaterialIcons, ou outros
- Use `ICON_SIZES.xxx`: xs(14), sm(18), md(22), lg(28), xl(36), xxl(48)
- **NUNCA** `size={20}` ❌ → `size={ICON_SIZES.sm}` ✅

### 5. Layout
- Use `layout.screen`, `layout.scroll`, `layout.header` de `src/styles/layout.js`
- **NUNCA** `paddingTop: 60` ❌ — já está em `layout.scroll`
- Importar: `import { layout, typography } from '../../src/styles';`

### 6. Sombras
- Use `SHADOWS.sm`, `SHADOWS.md`, `SHADOWS.lg`, `SHADOWS.glow` de `src/constants/shadows.js`

### 7. Animações
- Use hooks de `src/utils/animations.js`: `useFadeInUp`, `useStaggeredEntry`, `useAnimatedProgress`, `usePulseGlow`, `useAnimatedNumber`
- Screens devem usar `useStaggeredEntry` para entrada sequencial dos cards
