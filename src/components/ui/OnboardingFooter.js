// src/components/ui/OnboardingFooter.js
// Rodapé padrão das telas de onboarding — dois botões lado a lado com flex igual

import { View } from 'react-native';
import { Button } from './Button';
import { layout } from '../../styles';

/**
 * @param {object} props
 * @param {() => void} props.onBack - Ação do botão Anterior
 * @param {() => void} props.onNext - Ação do botão Próximo
 * @param {boolean} [props.canProceed=true] - Habilita/desabilita o botão Próximo
 * @param {string} [props.nextLabel='PRÓXIMO'] - Label do botão de avançar
 * @param {string} [props.backLabel='ANTERIOR'] - Label do botão de voltar
 * @param {boolean} [props.loading=false] - Estado de carregamento do botão Próximo
 */
export function OnboardingFooter({
  onBack,
  onNext,
  canProceed = true,
  nextLabel = 'PRÓXIMO',
  backLabel = 'ANTERIOR',
  loading = false,
}) {
  return (
    <View style={layout.footer}>
      <View style={{ flex: 1 }}>
        <Button
          title={backLabel}
          variant="secondary"
          icon="arrow-back"
          onPress={onBack}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Button
          title={nextLabel}
          icon={loading ? undefined : 'arrow-forward'}
          onPress={onNext}
          disabled={!canProceed}
          loading={loading}
          style={{ opacity: canProceed ? 1 : 0.5 }}
        />
      </View>
    </View>
  );
}
