// src/components/ui/AnimatedEntry.tsx
// Wrapper animado padronizado para entrada de conteudo - NOVAIX FITNESS  
import React from 'react';

import { Animated, StyleProp, ViewStyle } from 'react-native'

import { useEntryAnimation } from '../../hooks/useEntryAnimation';


interface AnimatedEntryProps {
  children: React.ReactNode; delay?: number;
  duration?: number;
  slideDistance?: number;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;

}


export default function AnimatedEntry(
{ children, delay, duration, slideDistance, enabled, style }: AnimatedEntryProps) 
{
  const { fade, slide } = useEntryAnimation(
{ delay, duration, slideDistance, enabled });
  return <Animated.View style=
{[
{ opacity: fade, transform: [
{ translateY: slide }] 
}, style]
}>
{children
}</Animated.View>;

}
