// src/components/workout/FilterModal.tsx
// Modal de Filtros Avançados Estilo Nike Training Club - NOVAIX FITNESS

import { memo } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import type { ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { LEVEL_FILTERS, DURATION_FILTERS, ACCESS_FILTERS, EQUIPMENT_FILTERS_SPECIFIC, CATEGORY_FILTERS, MUSCLE_FILTERS } from '../../data/filters';
import { typography } from '../../styles';
import { scale } from '../../utils/responsive';

interface FilterChip {
  key: string;
  label: string;
}

interface FilterSection {
  title: string;
  items: FilterChip[];
  value: string;
  setter: (value: string) => void;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  level: string;
  setLevel: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  access: string;
  setAccess: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  muscle: string;
  setMuscle: (value: string) => void;
  resultsCount: number;
  onClearAll: () => void;
}

function FilterModal({
  visible, onClose, level, setLevel, duration, setDuration, access, setAccess,
  equipment, setEquipment, category, setCategory, muscle, setMuscle, resultsCount, onClearAll
}: FilterModalProps): React.ReactElement {
  const activeFilters = [level, duration, access, equipment, category, muscle].filter(f => f && f !== 'all').length;

  const sections: FilterSection[] = [
    { title: 'CATEGORIA', items: CATEGORY_FILTERS, value: category, setter: setCategory },
    { title: 'GRUPO MUSCULAR', items: MUSCLE_FILTERS, value: muscle, setter: setMuscle },
    { title: 'EQUIPAMENTO', items: EQUIPMENT_FILTERS_SPECIFIC, value: equipment, setter: setEquipment },
    { title: 'NÍVEL', items: LEVEL_FILTERS, value: level, setter: setLevel },
    { title: 'DURAÇÃO', items: DURATION_FILTERS, value: duration, setter: setDuration },
    { title: 'ACESSO', items: ACCESS_FILTERS, value: access, setter: setAccess },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={typography.h4}>Filtrar</Text>
              {activeFilters > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{activeFilters}</Text></View>}
            </View>
            <View style={styles.headerActions}>
              {activeFilters > 0 && <TouchableOpacity onPress={onClearAll} style={styles.clearBtn}><Text style={styles.clearText}>Limpar</Text></TouchableOpacity>}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}><Ionicons name="close" size={20} color={COLORS.textTitle} /></TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {sections.map((section, idx) => (
              <View key={idx} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.grid}>
                  {section.items.map(f => {
                    const active = (section.value || 'all') === f.key;
                    return (
                      <TouchableOpacity key={f.key} style={[styles.chip, active && styles.chipActive]} onPress={() => section.setter(f.key)} activeOpacity={0.75}>
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
            <View style={{ height: SPACING.xl }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>{resultsCount > 0 ? `MOSTRAR ${resultsCount} TREINOS` : 'NENHUM TREINO ENCONTRADO'}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default memo(FilterModal);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', borderWidth: 1, borderColor: COLORS.border, paddingBottom: scale(20) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border + '40' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  badge: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.full, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  clearBtn: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
  clearText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1.2, marginBottom: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  gridVertical: { gap: SPACING.sm },
  chip: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border },
  chipFull: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: scale(13), color: COLORS.textDescription },
  chipTextActive: { fontFamily: 'Inter_600SemiBold', color: COLORS.background },
  footer: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  applyBtn: { height: 50, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  applyBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 1 },
});
