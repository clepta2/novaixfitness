// src/components/ui/FormValidation.tsx// Linha de validacao de formulario - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface FormValidationProps {
 isValid: boolean; message: string;

}
export function FormValidation(
{
isValid, message }: FormValidationProps) 
{
const colors = useColors();

return (    <View style=
{styles.row }>      <Ionicons        name=
{isValid ? 'checkmark-circle' : 'close-circle' }        size=
{14 }        color=
{isValid ? colors.primary : colors.error }      />      <Text style=
{[styles.text, {
color: isValid ? colors.primary : colors.error }]}>        
{message }      </Text>    </View>  );
}

const styles = StyleSheet.create(
{
 row: {
flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },  text: 
{
fontFamily: 'Inter_400Regular', fontSize: 12 },

});