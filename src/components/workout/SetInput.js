import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function SetInput({ weight, setWeight, reps, setReps, onAdd, saving }) {
  return (
    <View style={styles.row}>
      <View style={styles.container}>
        <Text style={typography.caption}>CARGA (KG)</Text>
        <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="0" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
      </View>
      <View style={styles.container}>
        <Text style={typography.caption}>REPS</Text>
        <TextInput style={styles.input} value={reps} onChangeText={setReps} placeholder="10" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={onAdd} disabled={saving}>
        {saving ? <ActivityIndicator size="small" color={COLORS.background} /> : <Ionicons name="add" size={24} color={COLORS.background} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.md, alignItems: 'flex-end', marginBottom: SPACING.md },
  container: { flex: 1 },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  addBtn: { width: 40, height: 40, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
});
