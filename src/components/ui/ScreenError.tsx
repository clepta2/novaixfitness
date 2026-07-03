// src/components/ui/ScreenError.tsx// Estado de erro reutilizavel com retry - NOVAIX FITNESS
import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface ScreenErrorProps {
 message?: string; onRetry?: () => void;

}
export default function ScreenError(
{
 message = 'Algo deu errado', onRetry,

}: ScreenErrorProps) 
{

return ( <View style=
{styles.container }>      <View style=
{styles.iconWrap }>        <Ionicons name="alert-circle-outline" size=
{48 } color=
{colors.error } />      </View>      <Text style=
{styles.title }>Erro</Text>      <Text style=
{styles.message }>
{message }</Text>      
{onRetry && ( <TouchableOpacity style=
{styles.retryBtn } onPress=
{onRetry } activeOpacity=
{0.7 }>          <Ionicons name="refresh" size=
{18 } color=
{colors.background } />          <Text style=
{styles.retryText }>Tentar novamente</Text>        </TouchableOpacity>      )

}    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: 
{
   flex: 1, justifyContent: 'center',    alignItems: 'center',    paddingHorizontal: SPACING.xl,    gap: SPACING.sm,  

},  iconWrap: 
{
   width: 80, height: 80,    borderRadius: 40,    backgroundColor: colors.errorBg,    justifyContent: 'center',    alignItems: 'center',    marginBottom: SPACING.sm,  

},  title: 
{
   fontFamily: 'Montserrat_700Bold', fontSize: 16,    color: colors.textTitle,  

},  message: 
{
   fontFamily: 'Inter_400Regular', fontSize: 14,    color: colors.textMuted,    textAlign: 'center',    lineHeight: 20,  

},  retryBtn: 
{
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.xs,    marginTop: SPACING.md,    paddingHorizontal: SPACING.lg,    paddingVertical: SPACING.sm,    backgroundColor: colors.primary,    borderRadius: BORDER_RADIUS.md,  

},  retryText: 
{
   fontFamily: 'Montserrat_600SemiBold', fontSize: 13,    color: colors.background,  

},

});