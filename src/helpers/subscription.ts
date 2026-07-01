// src/helpers/subscription.ts
// Helpers para tela de assinatura - NOVAIX FITNESS

import { Alert, Platform } from 'react-native';
import { cancelSubscription } from '../services/payment';

type SuccessCallback = () => void;

export async function confirmAndCancelSubscription(onSuccess?: SuccessCallback): Promise<void> {
  if (Platform.OS === 'web') {
    const confirmed = confirm('Tem certeza que deseja cancelar sua assinatura? Voce perdera acesso ao conteudo premium.');
    if (!confirmed) return;
    try {
      await cancelSubscription();
      alert('Sua assinatura foi cancelada.');
      onSuccess?.();
    } catch (err) {
      alert('Erro: ' + (err as Error).message);
    }
  } else {
    Alert.alert(
      'Cancelar assinatura',
      'Tem certeza que deseja cancelar? Voce perdera acesso ao conteudo premium.',
      [
        { text: 'Nao', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              Alert.alert('Cancelado', 'Sua assinatura foi cancelada.');
              onSuccess?.();
            } catch (err) {
              Alert.alert('Erro', (err as Error).message);
            }
          },
        },
      ]
    );
  }
}
