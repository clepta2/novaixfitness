import React from 'react';

import { Text } from 'react-native'

import { Ionicons } from '@expo/vector-icons';
import Row 
from './Row';

import { useColors } from '../../context/ThemeContext';


interface MetaRowProps {
  icon: string; text: string;
  color?: string;
  size?: number;

}


export default function MetaRow(
{ icon, text, color, size = 12 }: MetaRowProps) 
{
const colors = useColors();
  
return (
    <Row gap=
{4
}>
      <Ionicons name=
{icon as any
} size=
{size
} color=
{color || colors.textMuted
} />
      <Text style=
{
{ fontFamily: 'Inter_400Regular', fontSize: size, color: color || colors.textMuted }
}>
{text
}</Text>
    </Row>
  );
}
