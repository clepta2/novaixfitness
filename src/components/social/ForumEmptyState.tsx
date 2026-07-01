import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

export default function ForumEmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="chatbubbles-outline" size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>Nenhuma discussão</Text>
      <Text style={styles.subtitle}>Seja o primeiro a postar!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginTop: SPACING.md },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginTop: SPACING.xs },
});
