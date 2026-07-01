// src/components/ui/AnimatedCounter.tsx
// Contador animado que conta de 0 ao valor final — NOVAIX FITNESS

import React, { memo } from 'react';
import { Animated, Text, TextStyle } from 'react-native';
import { useAnimatedNumber } from '../../utils/animations';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  style?: TextStyle;
  duration?: number;
  decimals?: number;
}

interface AnimatedTextProps {
  animValue: Animated.Value;
  prefix: string;
  suffix: string;
  style?: TextStyle;
  decimals: number;
}

function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  style,
  duration = 800,
  decimals = 0,
}: AnimatedCounterProps) {
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

function AnimatedText({ animValue, prefix, suffix, style, decimals }: AnimatedTextProps) {
  const [displayValue, setDisplayValue] = React.useState<number | string>(0);

  React.useEffect(() => {
    const listener = animValue.addListener(({ value }: { value: number }) => {
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
