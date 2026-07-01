// src/components/faq/FaqItem.js
// Item de FAQ accordion - NOVAIX FITNESS

import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function FaqItem({ item, isExpanded, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => onToggle(item.id)} activeOpacity={0.8} accessibilityLabel={item.question} accessibilityRole="button" accessibilityState={{ expanded: isExpanded }} accessibilityHint={isExpanded ? 'Recolhe a resposta' : 'Expande a resposta'}>
        <Text style={styles.question}>{item.question}</Text>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.primary} />
      </TouchableOpacity>
      {isExpanded && <Text style={styles.answer}>{item.answer}</Text>}
    </View>
  );
}

export default memo(FaqItem);

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, flex: 1, marginRight: SPACING.md },
  answer: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, marginTop: SPACING.md, lineHeight: 20 },
});
