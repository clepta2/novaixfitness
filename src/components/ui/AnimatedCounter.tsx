// src/components/ui/AnimatedCounter.js
// Contador animado que conta de 0 ao valor final — NOVAIX FITNESS

import React, { memo } from 'react';
import { Animated, Text } from 'react-native';
import { useAnimatedNumber } from '../../utils/animations';

/**
 * Exibe um número que anima de 0 → value
 * @param {number} value - valor final
 * @param {string} suffix - sufixo (ex: "h", "XP", "%")
 * @param {string} prefix - prefixo (ex: "R$")
 * @param {object} style - estilo do texto
 * @param {number} duration - duração da animação em ms
 * @param {number} decimals - casas decimais (default 0)
 */
function AnimatedCounter({ value, suffix = '', prefix = '', style, duration = 800, decimals = 0 }) {
  const animValue = useAnimatedNumber(value, duration);

  return (
    <AnimatedText
      animValue={animValue}
      prefix={prefix}
      suffix={suffix}
      style={style}
      decimals={decimals}
    />
  );
}

// Componente interno que escuta mudanças de valor animado
function AnimatedText({ animValue, prefix, suffix, style, decimals }) {
  // Usar listener para atualizar o texto
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const listener = animValue.addListener(({ value }) => {
      setDisplayValue(decimals > 0 ? value.toFixed(decimals) : Math.round(value));
    });

    return () => animValue.removeListener(listener);
  }, [animValue, decimals]);

  return (
    <Text style={style}>
      {prefix}{displayValue}{suffix}
    </Text>
  );
}

export default memo(AnimatedCounter);
