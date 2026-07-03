// src/components/ui/SectionLabel.tsx
// Label de secao com texto uppercase

import { Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface SectionLabelProps {
 text: string; style?: object;

}
export function SectionLabel(
{
text, style }: SectionLabelProps) 
{

return (    <Text style=
{[styles.label, style] }>
{text }</Text>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 label: {
   fontFamily: 'Montserrat_600SemiBold', fontSize: 11,    color: colors.textMuted,    textTransform: 'uppercase',    letterSpacing: 1.2,    marginTop: SPACING.xl,    marginBottom: SPACING.md,  

},

});