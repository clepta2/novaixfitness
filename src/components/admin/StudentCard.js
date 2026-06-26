// src/components/admin/StudentCard.js
// Card de aluno no admin - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function StudentCard({ student }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.email}>{student.email}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={[styles.status, student.status === 'active' ? styles.active : styles.inactive]}>
          {student.status === 'active' ? 'Ativo' : 'Inativo'}
        </Text>
        <Text style={styles.plan}>{student.plan}</Text>
      </View>
    </View>
  );
}

export default memo(StudentCard);

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  email: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },
  meta: { alignItems: 'flex-end' },
  status: { fontFamily: 'Inter_400Regular', fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  active: { backgroundColor: COLORS.success + '20', color: COLORS.success },
  inactive: { backgroundColor: COLORS.error + '20', color: COLORS.error },
  plan: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
});
