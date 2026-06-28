import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function BasicInfoSection({ name, setName, description, setDescription, category, setCategory, level, setLevel, duration, setDuration, isPremium, setIsPremium, CATEGORIES, LEVELS }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>INFORMAÇÕES BÁSICAS</Text>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>NOME *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ex: Treino A - Peito" placeholderTextColor={COLORS.textMuted} />
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descreva o treino..." placeholderTextColor={COLORS.textMuted} multiline numberOfLines={3} />
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>CATEGORIA *</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map(opt => (
            <TouchableOpacity key={opt} style={[styles.chip, category === opt && styles.chipActive]} onPress={() => setCategory(opt)}>
              <Text style={[styles.chipText, category === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>NÍVEL</Text>
        <View style={styles.chipRow}>
          {LEVELS.map(opt => (
            <TouchableOpacity key={opt} style={[styles.chip, level === opt && styles.chipActive]} onPress={() => setLevel(opt)}>
              <Text style={[styles.chipText, level === opt && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>DURAÇÃO (MIN)</Text>
          <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="45" placeholderTextColor={COLORS.textMuted} />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>PREMIUM</Text>
          <TouchableOpacity style={[styles.toggleBtn, isPremium && styles.toggleActive]} onPress={() => setIsPremium(!isPremium)}>
            <Ionicons name={isPremium ? 'lock' : 'lock-open'} size={16} color={isPremium ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.toggleText, isPremium && styles.toggleTextActive]}>{isPremium ? 'Sim' : 'Não'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, marginHorizontal: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  field: { marginBottom: SPACING.md },
  fieldLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5, marginBottom: SPACING.xs },
  input: { height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.md },
  halfField: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.background },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, height: 44, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  toggleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.background },
});
