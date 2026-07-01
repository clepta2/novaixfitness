# SKILL: Security Enforcement

## Descrição
Esta skill É OBRIGATÓRIA para toda criação de código no projeto Novaix Fitness. Ela bloqueia a criação de código que não siga as regras de segurança.

## REGRAS INEGOCIÁVEIS (BLOQUEIA CÓDIGO SE NÃO SEGUIR)

### Regra 1: NUNCA Hardcoded Secrets
```javascript
// ❌ BLOQUEADO
const API_KEY = 'sk-1234567890'
const SECRET = 'my-secret'
const PASSWORD = 'admin123'

// ✅ CORRETO
const API_KEY = process.env.EXPO_PUBLIC_API_KEY
const SECRET = process.env.EXPO_PUBLIC_SECRET
```

### Regra 2: NUNCA console.log em produção
```javascript
// ❌ BLOQUEADO
console.log('debug:', data)
console.log(user)

// ✅ CORRETO (Opção 1 - if __DEV__)
if (__DEV__) console.log('debug:', data)

// ✅ CORRETO (Opção 2 - logger wrapper - RECOMENDADO)
// Criar src/utils/logger.js:
export const logger = {
  dev: (...args) => { if (__DEV__) console.log(...args); },
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};

// Usar em qualquer lugar:
import { logger } from '../utils/logger';
logger.dev('debug:', data);
logger.warn('aviso:', data);
logger.error('erro:', data);
```

### Regra 2b: Arquivos na Whitelist são ignorados
O verificador IGNORA estes caminhos (não precisa verificar):
- `node_modules/`
- `dist/`, `dist-test/`
- `.expo/`, `coverage/`
- `package-lock.json`, `yarn.lock`
- `android/`, `ios/`
- `__mocks__/`

### Regra 3: NUNCA eval() ou new Function()
```javascript
// ❌ BLOQUEADO
eval(userInput)
new Function('return ' + code)()

// ✅ CORRETO
JSON.parse(userInput)
// Usar switch/if em vez de eval
```

### Regra 4: NUNCA importar .env diretamente
```javascript
// ❌ BLOQUEADO
require('.env')
import '.env'

// ✅ CORRETO
process.env.EXPO_PUBLIC_VARIAVEL
```

### Regra 5: NUNCA usar dangerouslySetInnerHTML
```javascript
// ❌ BLOQUEADO
<div dangerouslySetInnerHTML={{__html: userContent}} />

// ✅ CORRETO
<div>{userContent}</div>
// ou usar DOMPurify antes
```

### Regra 6: NUNCA expor dados internos em responses
```javascript
// ❌ BLOQUEADO
res.json({ user, password_hash, internal_id })

// ✅ CORRETO
const { password_hash, internal_id, ...safeUser } = user
res.json(safeUser)
```

### Regra 7: NUNCA esquecer ErrorBoundary em telas
```javascript
// ❌ BLOQUEADO
export default function MyScreen() {
  return <View>...</View>
}

// ✅ CORRETO
export default function MyScreen() {
  return (
    <ErrorBoundary screenName="MyScreen">
      <View>...</View>
    </ErrorBoundary>
  )
}
```

### Regra 8: NUNCA usar fetch sem tratamento de erro
```javascript
// ❌ BLOQUEADO
const data = await fetch(url)

// ✅ CORRETO
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Erro na requisição')
  const data = await response.json()
} catch (err) {
  console.error('Erro ao buscar dados:', err)
}
```

### Regra 9: NUNCA confiar em input do usuário
```javascript
// ❌ BLOQUEADO
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRETO
const { data } = await supabase.from('users').select('*').eq('id', userId)
```

### Regra 10: NUNCA esquecer validação de input
```javascript
// ❌ BLOQUEADO
async function updateUser(id, data) {
  await supabase.from('users').update(data).eq('id', id)
}

// ✅ CORRETO
async function updateUser(id, data) {
  if (!id || !isValidUUID(id)) throw new Error('ID inválido')
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido')
  await supabase.from('users').update(data).eq('id', id)
}
```

## CHECKLIST DE SEGURANÇA (OBRIGATÓRIO ANTES DE CRIAR CÓDIGO)

### Para TODO componente React:
- [ ] Tem ErrorBoundary?
- [ ] Usa COLORS do design system?
- [ ] Usa SPACING do design system?
- [ ] Não tem console.log sem __DEV__?
- [ ] Não tem strings hardcoded (usa i18n)?
- [ ] Props são validadas?
- [ ] Event handlers têm try/catch?

### Para TODO serviço:
- [ ] Importa supabase?
- [ ] Tem tratamento de erro?
- [ ] Não expõe dados sensíveis?
- [ ] Usa queries parametrizadas?
- [ ] Tem rate limiting?
- [ ] Tem audit log?

### Para TODO componente de input:
- [ ] Validação de input
- [ ] Sanitização
- [ ] Max length
- [ ] Não aceita HTML/JS

### Para TODO componente de imagem:
- [ ] Valida tipo de arquivo
- [ ] Valida tamanho
- [ ] Não aceita executáveis
- [ ] Compressão antes de upload

## PADRÕES OBRIGATÓRIOS

### Arquivo de serviço sempre deve ter:
```javascript
import { supabase } from '../config/supabase';

export async function myFunction(userId, data) {
  try {
    // Validação
    if (!userId) throw new Error('userId é obrigatório');
    
    // Lógica
    const { data: result, error } = await supabase
      .from('table')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return result;
  } catch (err) {
    console.error('Erro em myFunction:', err);
    throw err;
  }
}
```

### Arquivo de componente sempre deve ter:
```javascript
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { ErrorBoundary } from '../ErrorBoundary';

function MyComponent({ prop1, prop2 }) {
  try {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{prop1}</Text>
      </View>
    );
  } catch (err) {
    console.error('Erro em MyComponent:', err);
    return null;
  }
}

export default function MyComponentWrapper(props) {
  return (
    <ErrorBoundary screenName="MyComponent">
      <MyComponent {...props} />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { padding: SPACING.md },
  text: { color: COLORS.textTitle },
});
```

### Arquivo de tela sempre deve ter:
```javascript
import { View, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { SPACING } from '../../src/constants/spacing';
import { Header, ErrorBoundary } from '../../src/components';

export default function MyScreen() {
  return (
    <ErrorBoundary screenName="MyScreen">
      <View style={styles.screen}>
        <Header title="MINHA TELA" showBack />
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Conteúdo */}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
});
```

## BLOQUEIOS AUTOMÁTICOS

O código será REJEITADO se conter:

1. `console.log(` sem `__DEV__`
2. `eval(` ou `new Function(`
3. Strings com `sk-`, `ghp_`, `API_KEY`, `SECRET`, `PASSWORD`
4. `fetch(` sem try/catch
5. `dangerouslySetInnerHTML`
6. `innerHTML`
7. `document.write`
8. Queries com `${variable}` direto
9. Componente sem ErrorBoundary
10. Arquivo > 200 linhas

## COMO USAR ESTA SKILL

Quando criando código, SEMPRE:
1. Verificar o checklist de segurança
2. Seguir os padrões obrigatórios
3. NUNCA quebrar as regras inegociáveis
4. Testar se o código passa no security-check.js

**ESTA SKILL É ATIVADA AUTOMATICAMENTE EM TODA CRIAÇÃO DE CÓDIGO.**
