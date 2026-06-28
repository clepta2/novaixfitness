import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { formatCEP } from '../../data/states';

export default function LocationFields({ state, setState, city, setCity, cep, setCep }) {
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (text) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formatted.replace(/\D/g, '')}/json/`);
        const data = await res.json();
        if (!data.erro) { setState(data.uf); setCity(data.localidade); }
      } catch {}
      setLoadingCep(false);
    }
  };

  return (
    <>
      <Text style={s.label}>LOCALIZAÇÃO</Text>
      <Text style={s.label}>CEP</Text>
      <View style={s.cepRow}>
        <View style={s.cepInputWrap}>
          <TextInput style={s.cepInput} placeholder="00000-000" placeholderTextColor={COLORS.textMuted} value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={9} />
          {loadingCep && <Ionicons name="sync" size={16} color={COLORS.primary} style={{ marginLeft: SPACING.sm }} />}
        </View>
      </View>
      <View style={{ height: SPACING.md }} />
      <Text style={s.label}>ESTADO</Text>
      <TouchableOpacity style={s.stateBtn} onPress={() => {}}>
        <Text style={[s.stateText, !state && { color: COLORS.textMuted }]}>{state || 'Selecionar estado'}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
      <View style={{ height: SPACING.md }} />
      <Text style={s.label}>CIDADE</Text>
      <TextInput style={s.cityInput} placeholder="Cidade" placeholderTextColor={COLORS.textMuted} value={city} onChangeText={setCity} />
    </>
  );
}

const s = StyleSheet.create({
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  cepRow: { flexDirection: 'row', gap: SPACING.sm },
  cepInputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  cepInput: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  stateBtn: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stateText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  cityInput: { height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
});
