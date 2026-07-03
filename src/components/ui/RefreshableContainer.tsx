// src/components/ui/RefreshableContainer.tsx// Container com pull-to-refresh reutilizavel - NOVAIX FITNESSimport React from 'react';

import { ScrollView, RefreshControl, StyleSheet } from 'react-native'

import { COLORS } from '../../constants/colors';

import { useColors } from '../../context/ThemeContext';

interface RefreshableContainerProps {
 refreshing: boolean; onRefresh: () => void;
 children: React.ReactNode;
 contentContainerStyle?: object;
 horizontal?: boolean;
 showsHorizontalScrollIndicator?: boolean;
 showsVerticalScrollIndicator?: boolean;
 style?: object;

}
export default function RefreshableContainer(
{
 refreshing, onRefresh,  children,  contentContainerStyle,  horizontal = 
false,  showsHorizontalScrollIndicator = 
false,  showsVerticalScrollIndicator = 
false,  style,

}: RefreshableContainerProps) 
{
const colors = useColors();
 

return (    <ScrollView      horizontal=
{horizontal }      contentContainerStyle=
{contentContainerStyle }      showsHorizontalScrollIndicator=
{showsHorizontalScrollIndicator }      showsVerticalScrollIndicator=
{showsVerticalScrollIndicator }      refreshControl=
{
       <RefreshControl refreshing=
{refreshing }          onRefresh=
{onRefresh }          tintColor=
{colors.primary }          colors=
{[colors.primary] }        />      

}      style=
{style }    >      
{children }    </ScrollView>  );
}