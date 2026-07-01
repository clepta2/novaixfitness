import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function StudentCard({ student, onEdit }) {
  const statusColor = student.status === 'active' ? COLORS.success : COLORS.error;
  const statusLabel = student.status === 'active' ? 'Ativo' : 'Inativo';

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(student.name || 'S')[0].toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{student.name}</Text>
        <Text style={styles.email} numberOfLines={1}>{student.email}</Text>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: statusColor + '15' }]}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.tagText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
          <View style={styles.planTag}>
            <Text style={styles.planText}>{student.plan}</Text>
          </View>
          <View style={[styles.planTag, { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}>
            <Text style={[styles.planText, { color: COLORS.primary }]}>
              {student.current_step === 'onboarding' ? 'Onboarding 📝' :
               student.current_step === 'pagamento' ? 'Pagamento 💳' :
               student.current_step === 'tutorial' ? 'Tutorial 🎓' : 'Completo ✅'}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => onEdit?.(student)} accessibilityLabel={`Editar ${student.name}`} accessibilityRole="button">
        <Ionicons name="pencil" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(StudentCard);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  email: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  tags: { flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.xs },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  planTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: COLORS.surface },
  planText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: COLORS.textMuted },
  editBtn: { padding: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.background },
});