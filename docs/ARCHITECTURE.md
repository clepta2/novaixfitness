# Arquitetura - NOVAIX FITNESS

## Visao Geral

O NOVAIX FITNESS e um aplicativo mobile de fitness construido com React Native e Expo, utilizando Supabase como backend.

## Stack Tecnologica

### Frontend
- **React Native** 0.85.3
- **Expo** 56
- **Expo Router** para navegacao
- **React Context** para estado global
- **AsyncStorage** para cache local

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **Express.js** para API customizada
- **Docker** para deploy

### Infraestrutura
- **GitHub Actions** para CI/CD
- **Detox** para testes E2E
- **Jest** para testes unitarios
- **Storybook** para documentacao de componentes

## Arquitetura de Componentes

```
src/
  components/           # Componentes reutilizaveis
    ui/                 # Componentes genericos (Button, Input, Card, etc)
    workout/            # Componentes de treino
    nutrition/          # Componentes de nutricao
    social/             # Componentes sociais
    profile/            # Componentes de perfil
    home/               # Componentes da home
    paywall/            # Componentes de pagamento
    admin/              # Componentes administrativos
    chat/               # Componentes de chat
    progress/           # Componentes de progresso
    settings/           # Componentes de configuracoes
    onboarding/         # Componentes de onboarding
    common/             # Componentes compartilhados
    marketplace/        # Componentes de marketplace
    recovery/           # Componentes de recuperacao
    notifications/      # Componentes de notificacoes
    wearable/           # Componentes de wearables
    referral/           # Componentes de indicacao
    faq/                # Componentes de FAQ
    auth/               # Componentes de autenticacao
    analytics/          # Componentes de analytics
    landing/            # Componentes de landing page
```

## Arquitetura de Servicos

```
src/services/
  analyticsTracker.js    # Tracking de eventos
  featureFlags.js        # Feature flags para A/B testing
  gamification.js        # Sistema de gamificacao
  social.js              # Features sociais
  aiRecommendations.js   # Recomendacoes IA
  healthIntegration.js   # Integracao com apps de saude
  monetization.js        # Sistema de monetizacao
  pushNotifications.js   # Push notifications
  notificationScheduler.js # Agendamento de notificacoes
  eventTracker.js        # Rastreamento de eventos
```

## Arquitetura de Hooks

```
src/hooks/
  useGamification.js     # Gamificacao
  useSocial.js           # Features sociais
  useAI.js               # IA/ML
  useHealth.js           # Integracao saude
  useSubscription.js     # Monetizacao
  useWorkoutPlayer.js    # Player de treino
  useFeedData.js         # Dados do feed
  useWorkoutDetail.js    # Detalhe do treino
  useProfile.js          # Perfil do usuario
  useNetworkStatus.js    # Status de rede
```

## Fluxo de Dados

```
Usuario -> Componente -> Hook -> Service -> Supabase -> Frontend
```

1. **Componente** renderiza UI e captura interacoes
2. **Hook** gerencia estado e logica de negocio
3. **Service** faz chamadas API e processa dados
4. **Supabase** armazena e retorna dados
5. **Frontend** atualiza UI com novos dados

## Padroes de Codigo

### Componentes
```javascript
// Componente funcional com memo
const MeuComponente = React.memo(function MeuComponente({ prop1, prop2 }) {
  // Logica
  return <View>...</View>;
});
```

### Hooks
```javascript
export function useMinhaFeature() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await service.getData();
      setState(data);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { state, loading, refresh: loadData };
}
```

### Services
```javascript
export async function getData(userId) {
  const { data, error } = await supabase
    .from('table')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}
```

## Seguranca

- Autenticacao via Supabase Auth
- RLS (Row Level Security) no PostgreSQL
- Rate limiting em APIs
- Input sanitization
- HTTPS em todas as comunicacoes

## Performance

- Lazy loading de componentes
- Memoizacao com React.memo e useMemo
- Cache de dados com AsyncStorage
- Otimizacao de imagens
- Code splitting

## Acessibilidade

- Labels em todos os elementos interativos
- Roles semanticos (button, link, etc)
- Contraste de cores adequado
- Suporte a leitores de tela

## Internacionalizacao

- Suporte a PT, EN, ES
- Hook useI18n para traducoes
- Formatacao de datas e numeros localizada
