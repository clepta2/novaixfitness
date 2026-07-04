// src/components/social/FeedEmptyState.tsx// Empty state especifico do feed - NOVAIX FITNESS
import React from 'react';

import { View, Text, StyleSheet } from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/colors'

import { SPACING } from '../../constants/spacing';

import { useColors } from '../../context/ThemeContext';

interface FeedEmptyStateProps {
 hasFilter?: boolean; }
export default function FeedEmptyState(
{
hasFilter = false }: FeedEmptyStateProps) 
{

return ( <View style=
{styles.container }>      <Ionicons name=
{hasFilter ? 'filter-outline' : 'chatbubbles-outline' } size=
{48 } color=
{colors.textMuted } />      <Text style=
{styles.title }>        
{hasFilter ? 'Nenhum post com este filtro' : 'Nenhum post ainda' }      </Text>      <Text style=
{styles.subtitle }>        
{hasFilter ? 'Tente trocar o filtro ou volte mais tarde' : 'Seja o primeiro a compartilhar algo!' }      </Text>    </View>  );
}

const colors = useColors();
const styles = StyleSheet.create({
 container: 
{
   alignItems: 'center', paddingVertical: SPACING.xxxl,    paddingHorizontal: SPACING.xl,    gap: SPACING.sm,  

},  title: 
{
   fontFamily: 'Montserrat_700Bold', fontSize: 16,    color: COLORS.textTitle,    textAlign: 'center',  

},  subtitle: 
{
   fontFamily: 'Inter_400Regular', fontSize: 13,    color: COLORS.textMuted,    textAlign: 'center',  

},

});