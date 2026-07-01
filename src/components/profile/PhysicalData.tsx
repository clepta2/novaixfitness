import React from 'react';
// src/components/profile/PhysicalData.js
// Dados físicos do usuário - NOVAIX FITNESS

import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function PhysicalData({ data }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <DataItem label="Altura" value={`${data.height} cm`} />
        <DataItem label="Peso" value={`${data.weight} kg`} />
        <DataItem label="Idade" value={`${data.age} anos`} />
        <DataItem label="IMC" value={data.imc.toString()} />
      </View>
    </View>
  );
}

function DataItem({ label, value }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.xs },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
});
