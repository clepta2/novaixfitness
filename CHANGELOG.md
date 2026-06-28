# NOVAIX FITNESS — Changelog

Todas as alterações notáveis do projeto documentadas aqui.

---

## [1.0.0] - 2026-06-28

### Refatoração de Código
- Refatorado `register.js` (228 → 147 linhas): extraído CPF, domínios, AccountExistsCard
- Refatorado `player.js` (223 → 149 linhas): compactado sem perda de funcionalidade
- Refatorado `settings.js` (207 → 139 linhas): extraído dados e estilos
- Refatorado `AuthContext.js` (202 → 119 linhas): extraído helper de IP
- Organizado 20 SQLs avulsos em `supabase/migrations/` com timestamps
- Removido `src/store/` (vazio)
- Consolidado 3 changelogs em CHANGELOG.md único

---

## [0.9.3] - 2026-06-27 — Sistema de Tema v3

### Adicionado
- **Sistema de Tema Claro/Escuro**: `ThemeContext.js` com detecção automática
- **Botões Melhorados**: variantes `back` e `danger`, props `iconPosition` e `size`
- **Tutorial com Voltar/Reiniciar**: botões de navegação no TutorialOverlay
- **Seletor de Tema**: 3 opções em Configurações (Escuro / Claro / Automático)

### Modificado
- `src/constants/colors.ts` — função `setThemeColors(theme)`
- `src/components/ui/Button.js` — novas variantes e estados
- `src/components/common/TutorialOverlay.js` — botões de navegação
- `app/settings.js` — seletor de tema e replay de tutorial

---

## [0.9.2] - 2026-06-27 — Tutoriais Adicionais v2

### Adicionado
- **Tutorial de Notificações** (`notifications`): 5 passos
- **Busca na Biblioteca melhorada**: adicionado passo "DICA DE BUSCA"

### Modificado
- `src/data/tutorials.js` — tutorial `notifications` + melhorias `library`
- `src/components/common/TutorialOverlay.js` — spotlights adicionais
- `app/notifications.js` — integrado tutorial

### Tutoriais Disponíveis

| Tela | ID | Passos |
|------|----|--------|
| Home | `home` | 6 |
| Biblioteca | `library` | 6 |
| Perfil | `perfil` | 5 |
| Comunidade | `feed` | 4 |
| Player | `player` | 4 |
| Notificações | `notifications` | 5 |

---

## [0.9.1] - 2026-06-27 — Sistema de Tutoriais

### Adicionado
- **Sistema de tutoriais por tela**: 5 tutoriais interativos
- `src/data/tutorials.js` — dados dos tutoriais
- `src/hooks/useTutorial.js` — hook React para gerenciamento
- Tutoriais para: Home (6 passos), Biblioteca (5), Perfil (5), Comunidade (4), Player (4)

### Modificado
- `src/services/tutorial.js` — suporte a múltiplos tutoriais
- `app/(tabs)/home.js`, `library.js`, `perfil/index.js`, `feed.js`, `player.js`, `settings.js`
