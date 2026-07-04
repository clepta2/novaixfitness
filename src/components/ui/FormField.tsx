// src/components/ui/FormField.tsx// Campo de formulario com label - NOVAIX FITNESS

import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING, BORDER_RADIUS } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface FormFieldProps extends TextInputProps 
{
 label: string; required?: boolean;

}
export function FormField(
{
label, required, style, ...props }: FormFieldProps) 
{

return (    <View style=
{styles.container }>      <Text style=
{styles.label }>
{label }
{required && ' *' }</Text>      <TextInput        style=
{[styles.input, style] }        placeholderTextColor=
{colors.textMuted }        
{...props }      />    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: {
marginBottom: SPACING.md },  label: 
{
fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.xs, letterSpacing: 0.5 },  input: 
{
backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, color: COLORS.textTitle, padding: SPACING.md, fontFamily: 'Inter_400Regular', fontSize: 14 },

});