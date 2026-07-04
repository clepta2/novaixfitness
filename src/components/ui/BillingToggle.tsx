// src/components/ui/BillingToggle.tsx// Toggle mensal/anual com badge de desconto - NOVAIX FITNESS

import { View, Text, Switch, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { SPACING, BORDER_RADIUS } from '../../constants/spacing'

import { useColors } from '../../context/ThemeContext';

interface BillingToggleProps {
 isAnnual: boolean; onToggle: (value: boolean) => void;
 discount?: string;

}
export function BillingToggle(
{
isAnnual, onToggle, discount = '-20%' }: BillingToggleProps) 
{

return (    <View style=
{styles.container }>      <Text style=
{[styles.label, !isAnnual && styles.labelActive] }>Mensal</Text>      <Switch        value=
{isAnnual }        onValueChange=
{onToggle }        trackColor={
{ false: colors.border, 
true: colors.primary + '60' }

}        thumbColor=
{isAnnual ? colors.primary : colors.textMuted }      />      <Text style=
{[styles.label, isAnnual && styles.labelActive] }>Anual</Text>      
{isAnnual && ( <View style=
{styles.badge }>          <Text style=
{styles.badgeText }>
{discount }</Text>        </View>      )

}    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: {
   flexDirection: 'row', alignItems: 'center',    justifyContent: 'center',    gap: SPACING.md,    marginBottom: SPACING.xl,    paddingVertical: SPACING.md,    backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.lg,    borderWidth: 1,    borderColor: COLORS.border,  

},  label: 
{
fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },  labelActive: 
{
color: COLORS.primary, fontFamily: 'Montserrat_700Bold' },  badge: 
{
backgroundColor: COLORS.success, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.full },  badgeText: 
{
fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },

});