# Guia de Tutoriais - NOVAIX FITNESS

## Visão Geral

O sistema de tutoriais permite criar guias interativos para cada tela do aplicativo, ajudando novos usuários a entenderem as funcionalidades.

## Estrutura do Sistema

### Arquivos Principais

1. **`src/data/tutorials.js`** - Dados dos tutoriais por tela
2. **`src/services/tutorial.js`** - Serviço de gerenciamento de tutoriais
3. **`src/hooks/useTutorial.js`** - Hook React para usar tutoriais
4. **`src/components/common/TutorialOverlay.js`** - Componente de overlay visual

## Como Adicionar um Novo Tutorial

### 1. Definir os Passos do Tutorial

Edite `src/data/tutorials.js` e adicione uma nova entrada:

```javascript
export const TUTORIALS = {
  // ... outros tutoriais existentes
  
  novaTela: {
    id: 'novaTela',
    title: 'Tutorial da Nova Tela',
    steps: [
      {
        id: 'step1',
        title: 'TÍTULO DO PASSO',
        description: 'Descrição clara do que o usuário deve fazer.',
        icon: 'icon-name', // Nome do ícone Ionicons
        screen: 'novaTela',
        target: 'elementId', // Opcional: elemento para destacar
      },
      // ... mais passos
    ],
  },
};
```

### 2. Adicionar Hook na Tela

No arquivo da tela (ex: `app/(tabs)/novaTela.js`):

```javascript
import { useTutorial } from '../../src/hooks/useTutorial';
import { TutorialOverlay } from '../../src/components';

export default function NovaTela() {
  const { visible, steps, handleComplete, handleSkip } = useTutorial('novaTela', true);
  
  return (
    <View>
      <TutorialOverlay
        visible={visible}
        steps={steps}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
      {/* Resto do conteúdo da tela */}
    </View>
  );
}
```

### 3. Configurar Spotlight (Opcional)

Para destacar elementos específicos, configure o `target` no passo e adicione as coordenadas em `TutorialOverlay.js`:

```javascript
const SPOTLIGHTS = {
  myElement: { 
    left: 16, 
    top: 130, 
    width: SCREEN_WIDTH - 32, 
    height: 180, 
    cardPosition: 'bottom' // ou 'top'
  },
};
```

## Tutoriais Disponíveis

| Tela | ID | Descrição |
|------|----|-----------|
| Home | `home` | Tutorial principal da aplicação |
| Biblioteca | `library` | Explorar treinos e filtros |
| Perfil | `perfil` | Acompanhar progresso e conquistas |
| Comunidade | `feed` | Interagir com outros atletas |
| Player | `player` | Executar treinos diários |

## Funcionalidades

### Auto-show
O tutorial aparece automaticamente na primeira visita à tela quando `autoShow = true`.

### Persistência
O status de conclusão é salvo no `AsyncStorage` e sincronizado com o Supabase.

### Resetar Tutoriais
Para resetar todos os tutoriais de um usuário:

```javascript
import { resetAllTutorials } from '../src/services/tutorial';

await resetAllTutorials(userId);
```

## Banco de Dados

Execute o script `add-multiple-tutorials.sql` para adicionar suporte a múltiplos tutoriais:

```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS tutorials_completed JSONB DEFAULT '{}';
```

## Boas Práticas

1. **Máximo 5-6 passos** por tutorial para não sobrecarregar o usuário
2. **Descrições curtas** e diretas (1-2 frases)
3. **Ícones relevantes** que reforcem a mensagem
4. **Destaque visual** para elementos importantes
5. **Botão "Pular"** sempre disponível
6. **Testar em diferentes tamanhos** de tela

## Exemplo Completo

```javascript
// src/data/tutorials.js
export const TUTORIALS = {
  settings: {
    id: 'settings',
    title: 'Tutorial das Configurações',
    steps: [
      {
        id: 'settings_welcome',
        title: 'CONFIGURAÇÕES',
        description: 'Personalize sua experiência no app.',
        icon: 'settings',
        screen: 'settings',
      },
      {
        id: 'settings_treino',
        title: 'OPÇÕES DE TREINO',
        description: 'Ative treinador por voz e timer de descanso.',
        icon: 'fitness',
        screen: 'settings',
        target: 'treinoGroup',
      },
      {
        id: 'settings_complete',
        title: 'PRONTO!',
        description: 'Suas preferências estão salvas.',
        icon: 'checkmark-circle',
        screen: 'settings',
      },
    ],
  },
};
```
