// src/components/ui/StepPill.tsx// Pill indicador de step no onboarding - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING, BORDER_RADIUS } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface StepPillProps {
 currentStep: number; totalSteps: number;

}
export function StepPill(
{
currentStep, totalSteps }: StepPillProps) 
{
const colors = useColors();

return (    <View style=
{styles.pill }>      <View style=
{styles.dot } />      <Text style=
{styles.text }>PASSO 
{currentStep } DE 
{totalSteps }</Text>    </View>  );
}

const styles = StyleSheet.create(
{
 pill: {
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.xs,    backgroundColor: COLORS.primary + '15',    paddingHorizontal: SPACING.md,    paddingVertical: SPACING.xs,    borderRadius: BORDER_RADIUS.full,    marginBottom: SPACING.lg,  

},  dot: 
{
   width: 6, height: 6,    borderRadius: 3,    backgroundColor: COLORS.primary,  

},  text: 
{
   fontFamily: 'Montserrat_600SemiBold', fontSize: 10,    color: COLORS.primary,    letterSpacing: 1.5,  

},

});