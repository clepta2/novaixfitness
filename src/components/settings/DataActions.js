import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function DataActions({ onExport, onDelete, loading }) {
  return (
    <View style={styles.section}>
      <Text style={typography.label}>GERENCIAR MEUS DADOS</Text>

      <TouchableOpacity style={styles.item} onPress={onExport} disabled={loading}>
        <View style={styles.itemLeft}>
          <View style={[styles.icon, { backgroundColor: COLORS.primary + '15' }]}>
            <Ionicons name="download-outline" size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.h5}>EXPORTAR DADOS</Text>
            <Text style={typography.caption}>Baixar arquivo JSON com todos os seus dados</Text>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={onDelete} disabled={loading}>
        <View style={styles.itemLeft}>
          <View style={[styles.icon, { backgroundColor: COLORS.error + '15' }]}>
            <Ionicons name="trash-outline" size={22} color={COLORS.error} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h5, { color: COLORS.error }]}>DELETAR MINHA CONTA</Text>
            <Text style={typography.caption}>Ação irreversível e permanente</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
