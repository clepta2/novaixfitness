// src/components/onboarding/AddressFields.tsx
// Campos de endereço (rua, bairro, número, referência)

import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const inputStyle = {
  height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
  borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg,
  color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium',
};

const labelStyle = {
  fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted,
  textTransform: 'uppercase' as const, letterSpacing: 1.2, marginBottom: SPACING.sm,
};

interface FieldProps { value: string; onChange: (v: string) => void; }

export function StreetField({ street, setStreet }: { street: string; setStreet: (v: string) => void }) {
  return (
    <View>
      <Text style={[labelStyle, { marginTop: SPACING.md }]}>RUA / LOGRADOURO</Text>
      <TextInput style={inputStyle} placeholder="Rua, Avenida..." placeholderTextColor={COLORS.textMuted} value={street} onChangeText={setStreet} />
    </View>
  );
}

export function NeighborhoodField({ neighborhood, setNeighborhood }: { neighborhood: string; setNeighborhood: (v: string) => void }) {
  return (
    <View>
      <Text style={[labelStyle, { marginTop: SPACING.md }]}>BAIRRO</Text>
      <TextInput style={inputStyle} placeholder="Bairro" placeholderTextColor={COLORS.textMuted} value={neighborhood} onChangeText={setNeighborhood} />
    </View>
  );
}

export function NumberNearRow({ number, setNumber, nearTo, setNearTo }: { number: string; setNumber: (v: string) => void; nearTo?: string; setNearTo?: (v: string) => void }) {
  return (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={[labelStyle, { marginTop: SPACING.md }]}>NÚMERO</Text>
        <TextInput style={inputStyle} placeholder="Nº" placeholderTextColor={COLORS.textMuted} value={number} onChangeText={setNumber} keyboardType="numeric" />
      </View>
      {nearTo !== undefined && (
        <View style={{ flex: 2 }}>
          <Text style={[labelStyle, { marginTop: SPACING.md }]}>PRÓXIMO DE</Text>
          <TextInput style={inputStyle} placeholder="Referência..." placeholderTextColor={COLORS.textMuted} value={nearTo} onChangeText={setNearTo} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({ row: { flexDirection: 'row', gap: SPACING.md } });
