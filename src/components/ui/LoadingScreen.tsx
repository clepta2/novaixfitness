// src/components/ui/LoadingScreen.tsx// Tela de carregamento reutilizavel - NOVAIX FITNESS
import React from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { useColors } from '../../context/ThemeContext';

interface LoadingScreenProps {
 size?: 'small' | 'large'; color?: string;

}
export default function LoadingScreen(
{
size = 'large', color = colors.primary }: LoadingScreenProps) 
{

return ( <View style=
{styles.container }>      <ActivityIndicator size=
{size } color=
{color } />    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: 
{
   flex: 1, justifyContent: 'center',    alignItems: 'center',    backgroundColor: COLORS.background,  

},

});