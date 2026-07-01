# Guia de Contribuicao - NOVAIX FITNESS

## Como Contribuir

### 1. Configuracao do Ambiente

```bash
# Clone o repositorio
git clone https://github.com/novaix/novaix-fitness.git
cd novaix-fitness

# Instale dependencias
npm install

# Configure o ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Inicie o desenvolvimento
npm start
```

### 2. Fluxo de Trabalho

1. Crie uma branch da feature (`git checkout -b feature/minha-feature`)
2. Faca suas alteracoes
3. Execute os testes (`npm test`)
4. Execute o lint (`npm run lint`)
5. Faca commit com mensagem descritiva
6. Abra um Pull Request

### 3. Convencoes de Commit

```
tipo: descricao curta

tipo:
- feat: nova funcionalidade
- fix: correcao de bug
- docs: documentacao
- style: formatacao
- refactor: refatoracao
- test: testes
- chore: tarefas de manutencao
```

Exemplos:
```
feat: adicionar sistema de gamificacao
fix: corrigir bug no player de treino
docs: atualizar guia de instalacao
test: adicionar testes para hook useGamification
```

### 4. Estrutura de Pastas

```
src/
  components/     # Componentes React Native
  hooks/          # Hooks customizados
  services/       # Servicos (API, storage, etc)
  constants/      # Constantes (cores, espacamento, etc)
  helpers/        # Funcoes utilitarias
  i18n/           # Internacionalizacao
  data/           # Dados mock e constantes
  context/        # React Context
  styles/         # Estilos globais
```

### 5. Regras de Codigo

- Arquivos maximo 200 linhas
- Componentes reutilizavel em src/components/
- Dados mock em src/data/
- Estilos inline so quando unico na tela
- Usar design system (COLORS, SPACING, BORDER_RADIUS)
- Fontes: Montserrat (titulos), Inter (corpo)
- Proteger console.error com `if (__DEV__)`
- Adicionar accessibilityLabel em elementos interativos

### 6. Testes

```bash
# Testes unitarios
npm test

# Testes com cobertura
npm run test:coverage

# Testes E2E (precisa de build primeiro)
npm run test:e2e:build:ios
npm run test:e2e:ios
```

### 7. Storybook

```bash
# Iniciar Storybook
npm run storybook

# Build do Storybook
npm run storybook:build
```

### 8. PR Template

```markdown
## Descricao
Breve descricao das alteracoes

## Tipo de Alteracao
- [ ] Nova funcionalidade
- [ ] Correcao de bug
- [ ] Refatoracao
- [ ] Documentacao
- [ ] Testes

## Checklist
- [ ] Codigo segue as convencoes
- [ ] Testes foram executados
- [ ] Lint passou
- [ ] Accessibility labels adicionados
- [ ] Documentacao atualizada (se necessario)
```

### 9. Issues

- Use templates de issues existentes
- Adicione labels apropriadas
- Link PRs para issues relacionadas

### 10. Releases

- Semver: MAJOR.MINOR.PATCH
- MAJOR: mudancas incompativeis
- MINOR: novas funcionalidades
- PATCH: correcoes de bug
