// src/components/ui/StepProgress.tsx// Barra de progresso de steps com label - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface StepProgressProps {
 currentStep: number; totalSteps: number;
 label?: string;

}
export function StepProgress(
{
currentStep, totalSteps, label }: StepProgressProps) 
{

 

const value = ((currentStep + 1) / totalSteps) * 100;
 

return (    <View style=
{styles.container }>      <View style=
{styles.track }>        <View style=
{[styles.fill, {
width: `$
{progress }%` 

}]} />      </View>      <Text style=
{styles.label }>
{label || `$
{Math.round(progress) }%`

}</Text>    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: {
width: '100%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },  track: 
{
flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },  fill: 
{
height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },  label: 
{
fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary, width: 36 },

});