# TradNinja

Plataforma de tradução offline para o Seu App.

[![Tests](https://img.shields.io/badge/tests-159+-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](#)
[![Offline](https://img.shields.io/badge/100%25-offline-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-yellow)](#)

## Por que TradNinja?

| Feature | API Tradução | TradNinja |
|---------|-------------|-------------------|
| Velocidade | ~300ms | **~0.02ms** |
| Custo | $20+/10k chars | **Grátis** |
| Internet | Obrigatória | **Não precisa** |
| Privacidade | Dados enviamos | **100% local** |
| Disponibilidade | 99.9% uptime | **100% offline** |

## Instalação

```bash
# npm
npm install tradninja

# git clone
git clone https://github.com/Seu App/translation.git

# cópia manual
cp -r translation/ /seu/projeto/src/translation/
```

## Quick Start

```tsx
import { TranslationProvider, useTranslation } from 'tradninja';

// Provider (App.js)
function App() {
  return (
    <TranslationProvider defaultLocale="pt">
      <MyApp />
    </TranslationProvider>
  );
}

// Hook
function Header() {
  const { t, locale, changeLocale } = useTranslation();
  return (
    <>
      <Text>{t('Bem-vindo!')}</Text>
      <Button onPress={() => changeLocale('en')} />
    </>
  );
}

// Componente T
import { T } from 'tradninja';
<Text>T k="Configurações" locale={locale} />

// Componente Trans
import { Trans } from 'tradninja';
<Trans k="Parabéns! Você subiu para o nível {level}!" level={5} />
```

## Arquitetura

```
translation/
├── src/
│   ├── core/           ← Engine de tradução
│   │   ├── engine.ts   ← Tradutor principal
│   │   ├── dictionary.ts ← Dicionário PT/EN/ES
│   │   ├── patterns.ts ← Padrões com interpolação
│   │   ├── rules.ts    ← Regras gramaticais
│   │   ├── cache.ts    ← Cache LRU em memória
│   │   └── types.ts    ← Tipos TypeScript
│   ├── modules/        ← Módulos especializados
│   │   ├── ui.ts       ← Scan de strings hardcoded
│   │   ├── comments.ts ← Tradução de comentários
│   │   ├── seo.ts      ← Meta tags e SEO
│   │   ├── video.ts    ← Metadados de vídeo
│   │   └── content.ts  ← Conteúdo dinâmico
│   ├── react/          ← Componentes React
│   │   ├── T.tsx       ← Componente simples
│   │   ├── Trans.tsx   ← Componente com parâmetros
│   │   ├── Provider.tsx← Context provider
│   │   ├── useTranslation.ts ← Hook
│   │   └── index.ts    ← Barrel exports
│   └── index.ts        ← Barrel principal
├── docs/               ← Documentação
├── package.json
└── LICENSE
```

## Módulos

| Módulo | Peso | Descrição |
|--------|------|-----------|
| `core/engine` | 100% | Tradutor com dict + patterns + rules + cache |
| `modules/ui` | 15% | Scan de strings hardcoded em .tsx |
| `modules/comments` | 10% | Extração e tradução de comentários |
| `modules/seo` | 8% | Meta tags, titles, keywords |
| `modules/video` | 12% | Títulos e tags de vídeos |
| `modules/content` | 6% | Conteúdo dinâmico do usuário |
| `react/T` | 3% | Componente Text traduzido |
| `react/Trans` | 4% | Componente com parâmetros |
| `react/Provider` | 5% | React Context provider |
| `react/useTranslation` | 2% | Hook de tradução |

## API Resumida

```tsx
// Engine
const translator = createTranslator({ cacheEnabled: true });
translator.translate('Olá', { target: 'en' }); // { text: 'Hello', matched: true }

// Módulos
scanForStrings('./app');              // ScanResult[]
translateSEO('home', seoData);       // Record<Language, SEOData>
translateVideoMetadata(video);        // TranslatedVideo
translateContent(text, { target });   // ContentResult

// React
const { t, locale, changeLocale } = useTranslation();
<T k="Bem-vindo" />
<Trans k="Nível {level}" level={3} />
```

## Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova`)
3. Commit suas alterações (`git commit -m 'Adiciona X'`)
4. Push para a branch (`git push origin feature/nova`)
5. Abra um Pull Request

## Licença

MIT License - Copyright (c) 2025 Jeferson

---

**Links**: [Documentação](./docs/) | [API Reference](./docs/API-REFERENCE.md) | [Como Usar](./docs/COMO-USAR.md)
